import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const NotFoundPage = () => {
  return (
    <div className="flex h-[80vh] flex-col items-center justify-center text-center space-y-6">
      <h1 className="text-9xl font-extrabold text-primary/20">404</h1>
      <h2 className="text-3xl font-bold tracking-tight">Page not found</h2>
      <p className="text-muted-foreground max-w-[500px]">
        Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
      </p>
      <Button asChild size="lg" className="mt-8">
        <Link to="/">Back to Home</Link>
      </Button>
    </div>
  );
};
