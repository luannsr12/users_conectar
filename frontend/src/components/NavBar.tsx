import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun, faBars, faTimes, faPowerOff } from "@fortawesome/free-solid-svg-icons";

export default function NavBar({ toggleDarkMode, darkMode }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
            <div className="navbar-links">
              <Link className="navbar-link" to="/admin/users">Usuários</Link>
              <Link className="navbar-link" to="/profile">Perfil</Link>
            </div>
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

            <button className="navbar-logout hidden md:block">
              <FontAwesomeIcon icon={faPowerOff} size="sm" /> &nbsp; Sair
            </button>
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
          <a className="hover:bg-gray-100 hover:text-gray-600 px-2 py-2 m-0 rounded" href="/" onClick={() => setMenuOpen(false)}>Home</a>
          <a className="hover:bg-gray-100 hover:text-gray-600 px-2 py-2 m-0 rounded" href="/profile" onClick={() => setMenuOpen(false)}>Perfil</a>
          <a className="hover:bg-gray-100 hover:text-gray-600 px-2 py-2 m-0 rounded" href="/settings" onClick={() => setMenuOpen(false)}>Configurações</a>
          <button className="navbar-logout mt-6" onClick={() => setMenuOpen(false)}>
            <FontAwesomeIcon icon={faPowerOff} size="sm" />
            &nbsp;
            Sair
          </button>
        </nav>
      </div>

      {/* BACKDROP */}
      {menuOpen && <div className="backdrop" onClick={() => setMenuOpen(false)}></div>}
    </>
  );
}
