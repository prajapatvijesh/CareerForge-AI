import { SignupForm } from '../components/SignupForm';

export const SignupPage = () => {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center flex flex-col items-center">
          <img src="/logo.jpg" alt="CareerForge AI Logo" className="h-16 w-16 mb-4 rounded-xl shadow-md object-cover" />
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight">
            Create an account
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Join <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-500">CareerForge AI</span> today
          </p>
        </div>
        <div className="mt-8">
          <SignupForm />
        </div>
      </div>
    </div>
  );
};
