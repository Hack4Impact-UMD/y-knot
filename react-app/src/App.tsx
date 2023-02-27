import { BrowserRouter, Routes, Route, redirect } from "react-router-dom";
import RequireAuth from "./auth/RequireAuth";
import RequireAdminAuth from "./auth/RequireAdminAuth";
import { AuthProvider } from "./auth/AuthProvider";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
