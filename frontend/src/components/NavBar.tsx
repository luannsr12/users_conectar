import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoon,
  faSun,
  faBars,
  faTimes,
  faSignOut,
  faSignIn,
  faPowerOff,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../contexts/AuthContext";

export default function NavBar({ LinksContent, toggleDarkMode, darkMode }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, accessToken } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav className={`navbar ${scrolled ? "glass" : "base-bg"}`}>
        <div className="navbar-container">
          {/* --- GROUP LEFT: logo + links --- */}
          <div className="flex items-center gap-8">
            <h1 className="navbar-title">🔥 MyPanel</h1>

            {/* LINKS DESKTOP */}
            {(true) && (
              <div className="navbar-links">
                <LinksContent />
              </div>
            )}
          </div>

          {/* --- GROUP RIGHT: actions --- */}
          <div className="navbar-actions">
            <button className="theme-toggle" onClick={toggleDarkMode}>
              <FontAwesomeIcon icon={darkMode ? faSun : faMoon} size="lg" />
            </button>

            {/* BOTÃO MENU MOBILE */}
            <button
              className="cursor-pointer md:hidden p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={() => setMenuOpen(true)}
            >
              <FontAwesomeIcon icon={faBars} size="lg" />
            </button>

            <div className="navbar-logout hidden md:block navbar-links">
              {!accessToken || !user ? (
                <Link className="navbar-link" to="/auth/login">
                  Login <FontAwesomeIcon icon={faSignIn} size="sm" />
                </Link>
              ) : (
                <Link className="navbar-link" to="/auth/logout">
                  Sair <FontAwesomeIcon icon={faSignOut} size="sm" />
                </Link>
              )}
            </div>
          </div>

        </div>
      </nav>

      {/* MENU MOBILE */}
      <div className={`mobile-menu card ${menuOpen ? "open" : ""}`}>
        <div className="mobile-menu-header">
          <h2 className="text-xl font-bold pl-2">Menu</h2>
          <button className="cursor-pointer" onClick={() => setMenuOpen(false)}>
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>
        <nav className="flex flex-col gap-3 mt-6">
          <LinksContent onClick={() => setMenuOpen(false)} />
        </nav>
      </div>

      {/* BACKDROP */}
      {menuOpen && (
        <div className="backdrop" onClick={() => setMenuOpen(false)}></div>
      )}
    </>
  );
}
