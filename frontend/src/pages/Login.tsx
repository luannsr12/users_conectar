import { useState, useEffect } from "react";
import { useApi } from "../utils/useApi";
import GoogleLoginButton from "../components/GoogleLoginButton";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { login, loading, error } = useApi();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Redireciona automaticamente se já estiver logado
  useEffect(() => {

    if (user) {
      if (user.role === "admin") {
        navigate("/admin/users", { replace: true });
      } else {
        navigate("/profile", { replace: true });
      }
    }
  }, [user, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const token = await login(email, password);
      const payload = JSON.parse(atob(token.split('.')[1]));
      const role = payload?.role || "user";

      if (role === "admin") {
        navigate("/admin/users");
      } else {
        navigate("/profile");
      }

    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="card bg-white shadow-md rounded px-8 py-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Login</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="hover:opacity-80 cursor-pointer w-full bg-blue-600 text-white px-3 py-2 rounded"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        {error && (
          <div className="mt-2 text-red-500 text-sm text-center">{error}</div>
        )}

        <div className="my-4 text-center text-gray-500">ou</div>
        <GoogleLoginButton />

        <p className="mt-4 text-sm text-center">
          Não tem conta?{" "}
          <a href="/register" className="text-blue-600">
            Criar Conta
          </a>
        </p>
      </div>
    </div>
  );
}
