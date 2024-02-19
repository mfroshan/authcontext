import { createContext, useContext,useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState("");
  const [isTokenValid, setIsTokenValid] = useState(false);
  const navigate = useNavigate();

  const login = async (username, password) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/login",
        { username, password },
        { withCredentials: true }
      );
      console.log(response.data.role);
      setUser(response.data.role);
      navigate("/protected");
    } catch (error) {
      console.error("Login failed:", error);
      throw error; // Consider providing more specific error handling or messages
    }
  };

  const checkTokenValidity = async () => {
    try {
      const response = await axios.get("http://localhost:3001/check-token", {
        withCredentials: true,
      });
      console.log(response.data.isValid);
      setIsTokenValid(response.data.isValid);
      return response.data.isValid;
    } catch (error) {
      console.error("Error checking token validity:", error);
      setIsTokenValid(false);
      return false;
    }
  };


  const logout = async () => {
    try {
        const response = await axios.post(
            "http://localhost:3001/api/logout",
            null,
            {
                withCredentials: true,
            }
        );

        if (response.data.message === "Logout successful") {
            console.log("Logout successful");
            navigate('/');
        } else {
            console.log("Logout failed");
        }
    } catch (error) {
        console.error("Logout failed:", error);
    }
};


  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      checkTokenValidity,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
