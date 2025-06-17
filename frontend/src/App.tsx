import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./contexts/AuthContext";
import { Login, Profile } from './pages';
import { Users } from './pages/(admin)';
import { useState, useEffect } from "react";


export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark";
    }
    return false; // fallback seguro para SSR ou Strict Mode
  });

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <BrowserRouter>
      <AuthProvider>
        <NavBar toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
        <main className={`min-h-screen w-full sm:w-[600px] md:w-[800px] lg:w-[1000px] xl:w-[1200px] mx-auto ${darkMode ? "dark" : ""}`}>
          <div className="w-full px-4">
            <Routes>

              {/* access public */}
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />

              {/* auth required */}
              <Route element={<PrivateRoute />}>

                {/* Users regular */}
                <Route path="/profile" element={<Profile />} />

                {/* requer Admin*/}
                <Route path="/admin/users" element={<Users />} />

              </Route>

            </Routes>
          </div>
        </main>
      </AuthProvider>
    </BrowserRouter>
  );
}
