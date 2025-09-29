// routes
import Router from "./routes";
// theme
import ThemeProvider from './theme';
// components
import ThemeSettings from './components/settings';
import LoadingScreen from './components/LoadingScreen';
// context
import { AuthProvider, useAuth } from './contexts/AuthContext';

function AppContent() {
  const { loading } = useAuth();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  return <Router />;
}

function App() {
  return (
    <ThemeProvider>
      <ThemeSettings>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeSettings>
    </ThemeProvider>
  );
}

export default App;
