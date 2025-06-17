import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/useAuthStore";

export default function Logout() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  logout();
 // navigate("/auth/login", { replace: true });
  return null;
}
