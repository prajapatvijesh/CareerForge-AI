import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useAppSelector } from '@/store/hooks';

export const LandingPage = () => {
  const { isAuthenticated } = useAppSelector(state => state.auth);
  return (
    <div className="flex flex-col items-center justify-center space-y-16 py-24 text-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6 max-w-3xl"
      >
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          Supercharge your career with <span className="text-primary text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">AI</span>
        </h1>
        <p className="mx-auto max-w-[700px] text-lg text-muted-foreground sm:text-xl">
          The ultimate platform for job seekers. Build resumes, prepare for interviews, and track applications with the power of artificial intelligence.
        </p>
        <div className="flex flex-col sm:flex-row justify-center sm:space-x-4 space-y-4 sm:space-y-0 w-full px-4 sm:px-0">
          {isAuthenticated ? (
            <Button asChild size="lg" className="rounded-full px-8 bg-indigo-600 hover:bg-indigo-700 w-full sm:w-auto">
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
          ) : (
            <Button asChild size="lg" className="rounded-full px-8 w-full sm:w-auto">
              <Link to="/signup">Get Started</Link>
            </Button>
          )}
          <Button size="lg" variant="outline" className="rounded-full px-8 w-full sm:w-auto">View Demo</Button>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl"
      >
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>AI Resume Builder</CardTitle>
            <CardDescription>Generate ATS-friendly resumes instantly.</CardDescription>
          </CardHeader>
          <CardContent>
            Tailor your resume to specific job descriptions with one click.
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Mock Interviews</CardTitle>
            <CardDescription>Practice with our AI recruiter.</CardDescription>
          </CardHeader>
          <CardContent>
            Get real-time feedback on your answers, tone, and confidence.
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Application Tracker</CardTitle>
            <CardDescription>Organize your job search.</CardDescription>
          </CardHeader>
          <CardContent>
            Keep track of all your applications, interviews, and offers in one dashboard.
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
