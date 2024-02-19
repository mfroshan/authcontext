import { Routes, Route } from "react-router-dom";
import { LoginPage } from "./pages/Login";
import { Secret } from "./pages/Secret";

import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthProvider } from "./hooks/useAuth";
import HomePage from "./pages/HomePage";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div>
    <ToastContainer />
    <AuthProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/protected"
          element={
            <ProtectedRoute>
              <Secret />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<HomePage />}></Route>
      </Routes>
    </AuthProvider>
    </div>
  );
}

export default App;