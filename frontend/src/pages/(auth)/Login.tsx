import { useState, useEffect } from "react";
import { apiHttp } from "../../utils/api";
import GoogleLoginButton from "../../components/GoogleLoginButton";
import { Link } from "react-router-dom";
import { MomentMessage, useMessageStore } from "../../stores/useMessageStore";
import { showToast } from "../../utils/swal";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/useAuthStore";

export default function Login() {
  const { login, loading, error, setError } = apiHttp();
  const [email, setEmail] = useState("");
  const { user, isSignIn } = useAuthStore();
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setMessage } = useMessageStore();

  useEffect(() => {
    if (!error) return;

    if (typeof error === 'string') {
      if (error.trim().length > 0) {
        showToast('error', `${error}`, 5000);
        setTimeout(() => {
          setError(null);
        }, 5000);
      }
    }

  }, [error, setError]);

  useEffect(() => {

    if (!isSignIn || !user?.id || !user?.role) return;

    navigate(
      (user?.role === 'admin' ? '/admin/users' : '/user/profile'),
      { replace: true }
    );

  }, [isSignIn, user]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {

      const token = await login(email, password);

      if (token){

        const payload = JSON.parse(atob(token.split('.')[1]));
        const role = payload?.role || "user";

        setMessage({
          'type': 'success',
          'message': "Login bem sucedido!"
        } as MomentMessage);
        
  
      }
     
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="card bg-white shadow-md rounded px-8 py-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-3">Login</h2>

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
            className="hover:opacity-80 cursor-pointer w-full bg-purple-700 text-white px-3 py-2 rounded"
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
          <Link to="/auth/register" className="text-purple-400">
            Criar Conta
          </Link>
        </p>
      </div>
    </div>
  );
}
