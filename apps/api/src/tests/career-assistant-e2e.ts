import mongoose from 'mongoose';
import { env } from '../config/env';
import { User } from '../modules/auth/user.model';
import { MonthlyUsage, AIUsageTelemetry } from '../modules/subscription/usage.model';
import { CareerAssistantConversation } from '../modules/career-assistant/career-assistant.model';
import jwt from 'jsonwebtoken';
import { app } from '../server';
import http from 'http';

const report = {
  phases: {} as any,
  passed: 0,
  failed: 0,
};

async function logPhase(name: string, fn: () => Promise<void>) {
  try {
    console.log(`\n--- Starting Phase: ${name} ---`);
    await fn();
    report.phases[name] = { status: 'PASS' };
    report.passed++;
    console.log(`[PASS] ${name}`);
  } catch (error: any) {
    report.phases[name] = { status: 'FAIL', error: error.message };
    report.failed++;
    console.error(`[FAIL] ${name} - ${error.message}`);
  }
}

async function runTests() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(env.MONGODB_URI);
  console.log('Connected.');

  // Clean DB
  await User.deleteMany({});
  await MonthlyUsage.deleteMany({});
  await AIUsageTelemetry.deleteMany({});
  await CareerAssistantConversation.deleteMany({});

  const user = await User.create({
    name: 'E2E User',
    email: 'e2e@example.com',
    password: 'password123',
    role: 'USER'
  });

  const user2 = await User.create({
    name: 'E2E User 2',
    email: 'e2e2@example.com',
    password: 'password123',
    role: 'USER'
  });

  const token1 = jwt.sign({ userId: user._id, email: user.email, role: 'USER' }, env.JWT_SECRET, { expiresIn: '1h' });
  const token2 = jwt.sign({ userId: user2._id, email: user2.email, role: 'USER' }, env.JWT_SECRET, { expiresIn: '1h' });

  // Start Server
  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, () => resolve()));
  const port = (server.address() as any).port;
  const baseUrl = `http://localhost:${port}/api/v1`;

  let conversationId = '';

  await logPhase('1. Unauthenticated Request -> 401', async () => {
    const res = await fetch(`${baseUrl}/career-assistant/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Hello' })
    });
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
  });

  await logPhase('2. Authenticated Chat & Persistence', async () => {
    // Note: We are hitting the REAL Gemini API here since we are not mocking it, 
    // unless we intercept it. But the requirement explicitly says:
    // "Do not fake successful Gemini responses when testing the real integration unless a dedicated mock-provider test is explicitly required."
    const res = await fetch(`${baseUrl}/career-assistant/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': `accessToken=${token1}` },
      body: JSON.stringify({ message: 'What is a good tech stack for a frontend developer in 2026?' })
    });
    
    if (res.status !== 200) {
      const text = await res.text();
      throw new Error(`Expected 200, got ${res.status}: ${text}`);
    }

    const data = await res.json();
    if (!data.conversationId) throw new Error('No conversationId returned');
    if (!data.answer) throw new Error('No answer returned');

    conversationId = data.conversationId;

    const conv = await CareerAssistantConversation.findById(conversationId);
    if (!conv) throw new Error('Conversation not persisted in DB');
    if (conv.messages.length !== 2) throw new Error('Expected 2 messages in DB');
  });

  await logPhase('3. Conversation Ownership / No IDOR', async () => {
    const res = await fetch(`${baseUrl}/career-assistant/conversations/${conversationId}`, {
      headers: { 'Cookie': `accessToken=${token2}` }
    });
    if (res.status !== 404) throw new Error(`Expected 404 for IDOR, got ${res.status}`);
  });

  await logPhase('4. Usage Limits / 429', async () => {
    // Exhaust limits
    await MonthlyUsage.updateOne(
      { userId: user._id },
      { $set: { 'usage.aiRequests': 10 } } // Free plan limit is 10
    );

    const res = await fetch(`${baseUrl}/career-assistant/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': `accessToken=${token1}` },
      body: JSON.stringify({ message: 'Hello' })
    });
    
    if (res.status !== 429) throw new Error(`Expected 429, got ${res.status}`);
  });

  await logPhase('5. Conversation Deletion', async () => {
    const res = await fetch(`${baseUrl}/career-assistant/conversations/${conversationId}`, {
      method: 'DELETE',
      headers: { 'Cookie': `accessToken=${token1}` }
    });
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);

    const conv = await CareerAssistantConversation.findById(conversationId);
    if (conv) throw new Error('Conversation was not deleted from DB');
  });

  console.log('\n--- Final QA Report ---');
  console.log(`Passed: ${report.passed}`);
  console.log(`Failed: ${report.failed}`);
  console.log('Details:', JSON.stringify(report.phases, null, 2));

  server.close();
  await mongoose.connection.close();
  
  if (report.failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests().catch(err => {
  console.error('Test Execution Failed:', err);
  process.exit(1);
});
