import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RequireAuth from './auth/RequireAuth';
import RequireAdminAuth from './auth/RequireAdminAuth';
import { AuthProvider } from './auth/AuthProvider';
import SamplePage from './pages/SamplePage/SamplePage';
import Sample404Page from './pages/Sample404Page/Sample404Page';
import LoginPage from './pages/LoginPage/LoginPage';
import NavigationBar from './components/NavigationBar/NavigationBar';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RequireAuth children={<SamplePage />} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="*"
            element={<RequireAuth children={<Sample404Page />} />}
          />
          <Route path="/nav" element= {<NavigationBar /> }/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
