import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { AuthProvider } from './app/auth/AuthContext';
import LandingPage from './app/landing/LandingPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;