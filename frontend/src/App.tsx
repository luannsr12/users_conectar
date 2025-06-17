import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import { routes } from './routesConfig';
import { useState, useEffect } from "react";

import { useThemeStore } from "./stores/useThemeStore";

import AdminProvider from "./contexts/AdminProvider";
import PrivateProvider from "./contexts/PrivateProvider";
import { AuthProvider } from "./contexts/AuthContext";
import RegularUserProvider from "./contexts/RegularUserProvider";
import { useAuthStore } from "./stores/useAuthStore";

export default function App() {

  const { darkMode, toggleDarkMode } = useThemeStore();

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
      </AuthProvider>
    </BrowserRouter>
  );
}

function AppContent({ toggleDarkMode, darkMode }: { toggleDarkMode: () => void; darkMode: boolean }) {

  return (
    <>

      <main className={`min-h-screen w-full sm:w-[600px] md:w-[800px] lg:w-[1000px] xl:w-[1200px] mx-auto ${darkMode ? "dark" : ""}`}>
        <div className="w-full px-4">
          <Routes>

            {/* Rotas públicas */}
            {routes.filter(r => r.isPublic).map(({ path, element: Element }) => (
              <Route key={path} path={path} element={<Element />} />
            ))}
          </Routes>

          {/* Rotas privadas */}

          <PrivateProvider >
            <Routes>
           
                {/* Rotas admin dentro de um Route com AdminProvider */}
                <Route element={<AdminProvider />}>
                  {routes
                    .filter(r => !r.isPublic && r.path.startsWith("/admin"))
                    .map(({ path, element: Element }) => (
                      <Route key={path} path={path} element={<Element />} />
                    ))}
                </Route>

                {/* Rotas privadas que não são admin */}
                <Route element={<RegularUserProvider />}>
                  {routes
                    .filter(r => !r.isPublic && !r.path.startsWith('/admin'))
                    .map(({ path, element: Element }) => (
                      <Route key={path} path={path} element={<Element />} />
                    ))}
                </Route>
               
            </Routes>

          </PrivateProvider>

        </div>
      </main>
    </>
  );
}
