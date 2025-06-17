import React, { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import LinksContent from "../components/User/navbar";
import { useThemeStore } from "../stores/useThemeStore";

export default function RegularUserProvider() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { darkMode, toggleDarkMode } = useThemeStore();

    return (
        <>
            <NavBar LinksContent={LinksContent} toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
            <Outlet />
        </>
    );
}
