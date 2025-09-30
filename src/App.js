// routes
import Router from "./routes";
// theme
import ThemeProvider from './theme';
// components
import ThemeSettings from './components/settings';
import {AuthProvider} from "./contexts/AuthContext";

function App() {
  return (
    <ThemeProvider>
      <ThemeSettings>
          <AuthProvider>

              <Router /></AuthProvider>
      </ThemeSettings>
    </ThemeProvider>
  );
}

export default App;
