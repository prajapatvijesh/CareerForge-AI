import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeProvider';
import { router } from './routes';
import { AuthInitialize } from './features/auth/components/AuthInitialize';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="careerforge-ui-theme">
      <AuthInitialize>
        <RouterProvider router={router} />
      </AuthInitialize>
    </ThemeProvider>
  );
}

export default App;
