import React, { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import LinksContent from "../components/Admin/navbar";
import { useThemeStore } from "../stores/useThemeStore";

export default function AdminProvider() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { darkMode, toggleDarkMode } = useThemeStore();

    useEffect(() => {
        if (!user || user.role !== "admin") {
            navigate("/user/profile", { replace: true });
        }
    }, [user, navigate]);

    return (
        <>
            <NavBar LinksContent={LinksContent} toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
            <Outlet />
        </>
    );
}
