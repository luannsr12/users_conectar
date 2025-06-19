import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useThemeStore } from "./stores/useThemeStore";
import { routes } from './routesConfig';
import AdminProvider from "./contexts/AdminProvider";
import ProtectedLayout from "./contexts/PrivateProvider";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import RegularUserProvider from "./contexts/RegularUserProvider";
import PhoneMockup from "./components/mockup/mobile";
import FloatingButtonProps from "./components/mockup/button";
import { useMockup } from "./stores/useMockup";

// Função para detectar se está dentro de um iframe
const isInsideIframe = () => {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
};

export default function App() {
  const { darkMode } = useThemeStore();

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

function AppContent() {
  const { darkMode } = useThemeStore();
  const { isMobile, toggleIsMobile } = useMockup();
  const location = useLocation();

  const isInIframe = isInsideIframe();

  return (
    <main className={`min-h-screen w-full mx-auto ${darkMode ? "dark" : ""}`}>
      <div className={"mx-auto md:w-[95%] w-[90%]" + (!isMobile ? "" : "")}>

        {!isInIframe && (
          <>
            <FloatingButtonProps onClick={toggleIsMobile} />

            {isMobile && (
              <div className="fixed bottom-4 right-4 z-50 w-[300px] h-[600px]">
                <PhoneMockup src={location.pathname} />
              </div>
            )}
          </>
        )}

        <Routes>
          {renderPublicRoutes()}
          <Route element={<ProtectedLayout />}>
            {renderPrivateRoutes()}
            {renderAdminRoutes()}
          </Route>
        </Routes>
      </div>
    </main>
  );
}

function renderPublicRoutes() {
  return routes.public.map(({ path, element: Element }) => (
    <Route key={path} path={path} element={<Element />} />
  ));
}

function renderPrivateRoutes() {
  return (
    <Route element={<RegularUserProvider />}>
      {routes.private.map(({ path, element: Element }) => (
        <Route key={path} path={path} element={<Element />} />
      ))}
    </Route>
  );
}

function renderAdminRoutes() {
  return (
    <Route element={<AdminProvider />}>
      {routes.admin.map(({ path, element: Element }) => (
        <Route key={path} path={path} element={<Element />} />
      ))}
    </Route>
  );
}
