import { SignupForm } from '../components/SignupForm';

export const SignupPage = () => {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight">
            Create an account
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Join CareerForge AI today
          </p>
        </div>
        <div className="mt-8">
          <SignupForm />
        </div>
      </div>
    </div>
  );
};
