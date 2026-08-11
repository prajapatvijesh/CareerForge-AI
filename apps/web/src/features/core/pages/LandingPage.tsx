import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useAppSelector } from '@/store/hooks';
import { Sparkles, FileText, Video, Briefcase, ArrowRight, Target, Shield, Zap } from 'lucide-react';

export const LandingPage = () => {
  const { isAuthenticated } = useAppSelector(state => state.auth);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center pt-32 pb-24 text-center overflow-hidden w-[100vw] relative left-[50%] right-[50%] -ml-[50vw] -mr-[50vw]">
        {/* Background Gradients */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100 via-background to-background dark:from-indigo-950 dark:via-background dark:to-background"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-[100px] pointer-events-none"></div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="space-y-8 max-w-4xl px-4 relative z-10 mx-auto"
        >
          <div className="inline-flex items-center rounded-full border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 text-sm font-medium text-indigo-800 dark:text-indigo-300 mb-4 shadow-sm backdrop-blur-sm">
            <Sparkles className="mr-2 h-4 w-4" />
            <span>Meet your new AI Career Coach</span>
          </div>
          
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl leading-tight text-foreground">
            Supercharge your career with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-500 dark:from-indigo-400 dark:via-purple-400 dark:to-blue-400">AI</span>
          </h1>
          
          <p className="mx-auto max-w-[700px] text-lg text-muted-foreground sm:text-xl md:text-2xl font-light">
            The ultimate platform for ambitious professionals. Build standout resumes, crush interviews, and track applications with the power of artificial intelligence.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center sm:space-x-6 space-y-4 sm:space-y-0 w-full px-4 sm:px-0 mt-8">
            {isAuthenticated ? (
              <Button asChild size="lg" className="rounded-full px-8 h-14 text-base font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25 transition-all hover:scale-105">
                <Link to="/dashboard">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            ) : (
              <Button asChild size="lg" className="rounded-full px-8 h-14 text-base font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25 transition-all hover:scale-105">
                <Link to="/signup">
                  Get Started for Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            )}
            <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-base font-semibold backdrop-blur-sm bg-background/50 border-2 transition-all hover:bg-muted">
              View Demo
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/50 border-y relative w-[100vw] left-[50%] right-[50%] -ml-[50vw] -mr-[50vw]">
        <div className="container px-4 md:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Everything you need to get hired</h2>
            <p className="text-muted-foreground text-lg max-w-[600px] mx-auto">CareerForge AI replaces 5 different tools by bringing your entire job search workflow into one intelligent dashboard.</p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {[
              {
                title: "AI Resume Builder",
                description: "Generate ATS-friendly resumes instantly. Tailor your resume to specific job descriptions with one click.",
                icon: FileText,
                color: "text-blue-500",
                bg: "bg-blue-500/10"
              },
              {
                title: "Mock Interviews",
                description: "Practice with our AI recruiter. Get real-time feedback on your answers, tone, and confidence.",
                icon: Video,
                color: "text-purple-500",
                bg: "bg-purple-500/10"
              },
              {
                title: "Application Tracker",
                description: "Organize your job search. Keep track of all your applications, interviews, and offers in one beautiful Kanban board.",
                icon: Briefcase,
                color: "text-indigo-500",
                bg: "bg-indigo-500/10"
              },
              {
                title: "Smart Career Coach",
                description: "Receive personalized guidance, skill gap analysis, and learning priorities based on your target roles.",
                icon: Target,
                color: "text-rose-500",
                bg: "bg-rose-500/10"
              },
              {
                title: "Lightning Fast",
                description: "Powered by Gemini AI for instantaneous analysis and generation. Your time is valuable, don't wait.",
                icon: Zap,
                color: "text-amber-500",
                bg: "bg-amber-500/10"
              },
              {
                title: "Bank-Grade Security",
                description: "Your professional data is yours. We use enterprise-grade encryption and strict access controls.",
                icon: Shield,
                color: "text-emerald-500",
                bg: "bg-emerald-500/10"
              }
            ].map((feature, idx) => (
              <motion.div key={idx} variants={itemVariants}>
                <Card className="h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-border/50 bg-background/50 backdrop-blur-sm">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.bg}`}>
                      <feature.icon className={`w-6 h-6 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden w-[100vw] left-[50%] right-[50%] -ml-[50vw] -mr-[50vw]">
        <div className="absolute inset-0 bg-indigo-600 dark:bg-indigo-900 -z-20"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 -z-10 mix-blend-overlay"></div>
        <div className="container px-4 md:px-8 max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">Ready to land your dream job?</h2>
          <p className="text-indigo-100 text-lg md:text-xl max-w-2xl mx-auto">
            Join thousands of professionals who have accelerated their careers with CareerForge AI.
          </p>
          <div className="pt-4">
            <Button asChild size="lg" className="rounded-full px-10 h-14 text-lg font-bold bg-white text-indigo-600 hover:bg-indigo-50 shadow-xl transition-transform hover:scale-105">
              <Link to="/signup">Start Building Your Future</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
