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
            <Link className="navbar-link" to="/admin/users" onClick={onClick}>
                Usuários
            </Link>

            <Link className="navbar-link" to="/admin/profile" onClick={onClick}>
                Perfil
            </Link>
        </>
    );
}