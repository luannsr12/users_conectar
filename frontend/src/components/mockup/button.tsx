import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMobile } from "@fortawesome/free-solid-svg-icons";

interface FloatingButtonProps {
    onClick: () => void;
}

export default function FloatingButton({ onClick }: FloatingButtonProps) {
    return (
        <button
            onClick={onClick}
            className="cursor-pointer fixed bottom-6 left-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
            title="Ativar visualização mobile"
            aria-label="Alternar visualização de dispositivo móvel"
        >
            <FontAwesomeIcon
                icon={faMobile}
                className="w-10 h-10 transform transition-transform duration-300 hover:rotate-12"
            />

            {/* Efeito de pulsação sutil */}
            <span className="absolute inset-0 rounded-full bg-blue-400 opacity-0 hover:opacity-20 transition-opacity duration-300"></span>
        </button>
    );
}