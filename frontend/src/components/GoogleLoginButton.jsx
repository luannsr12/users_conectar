import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

export default function GoogleLoginButton() {
    return (
      <button
        className="w-full flex items-center justify-center border px-3 py-2 rounded hover:bg-gray-50"
        onClick={() => console.log("Login com Google ainda não implementado")}
      >
        <FontAwesomeIcon icon={faGoogle} className="mr-2" />
        Login com Google
      </button>
    );
  }
  