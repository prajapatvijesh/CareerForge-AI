import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center space-x-3">
              <img src="/logo.jpg" alt="CareerForge AI Logo" className="h-8 w-8 rounded-md object-cover shadow-sm" />
              <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-500 dark:from-indigo-400 dark:via-purple-400 dark:to-blue-400">
                CareerForge AI
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mt-4">
              Empowering job seekers with AI-driven resume building, interview prep, and career strategy. Your dream job awaits.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-muted-foreground hover:text-indigo-500 transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-indigo-500 transition-colors">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-indigo-500 transition-colors">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>

          {/* Links Section */}
          <div className="grid grid-cols-2 gap-8 md:col-span-3 lg:grid-cols-3">
            <div className="space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">Product</h4>
              <ul className="space-y-3">
                <li><Link to="/features" className="text-sm text-muted-foreground hover:text-indigo-500 transition-colors">Features</Link></li>
                <li><Link to="/pricing" className="text-sm text-muted-foreground hover:text-indigo-500 transition-colors">Pricing</Link></li>
                <li><Link to="/resumes" className="text-sm text-muted-foreground hover:text-indigo-500 transition-colors">Resume Builder</Link></li>
                <li><Link to="/interviews" className="text-sm text-muted-foreground hover:text-indigo-500 transition-colors">Mock Interviews</Link></li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">Resources</h4>
              <ul className="space-y-3">
                <li><Link to="/blog" className="text-sm text-muted-foreground hover:text-indigo-500 transition-colors">Blog</Link></li>
                <li><Link to="/career-tips" className="text-sm text-muted-foreground hover:text-indigo-500 transition-colors">Career Tips</Link></li>
                <li><Link to="/help" className="text-sm text-muted-foreground hover:text-indigo-500 transition-colors">Help Center</Link></li>
                <li><Link to="/api" className="text-sm text-muted-foreground hover:text-indigo-500 transition-colors">API Documentation</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">Company</h4>
              <ul className="space-y-3">
                <li><Link to="/about" className="text-sm text-muted-foreground hover:text-indigo-500 transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="text-sm text-muted-foreground hover:text-indigo-500 transition-colors">Contact</Link></li>
                <li><Link to="/privacy" className="text-sm text-muted-foreground hover:text-indigo-500 transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-sm text-muted-foreground hover:text-indigo-500 transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} CareerForge AI Inc. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center">
            Designed with <span className="text-red-500 mx-1">❤</span> for your career.
          </p>
        </div>
      </div>
    </footer>
  );
};
