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

export default function LinksContent({ onClick }: { onClick?: () => void }) {

    return (
        <>
            <Link className="navbar-link" to="/user/profile" onClick={onClick}>
                Meu Perfil
            </Link>
        </>
    );
}