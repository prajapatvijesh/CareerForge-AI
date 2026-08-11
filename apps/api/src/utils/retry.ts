export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelayMs: number = 1000,
  timeoutMs: number = 30000
): Promise<T> {
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      // Execute the operation with a timeout
      const result = await Promise.race([
        operation(),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Operation timed out')), timeoutMs)
        )
      ]);
      return result;
    } catch (error: any) {
      attempt++;
      console.warn(`[Retry ${attempt}/${maxRetries}] Operation failed: ${error.message}`);
      
      if (attempt >= maxRetries) {
        throw new Error(`Operation failed after ${maxRetries} attempts: ${error.message}`);
      }

      // Exponential backoff
      const delay = baseDelayMs * Math.pow(2, attempt - 1);
      await new Promise(res => setTimeout(res, delay));
    }
  }

  throw new Error('Unexpected end of retry loop');
}
