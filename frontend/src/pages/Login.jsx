import GoogleLoginButton from "../components/GoogleLoginButton";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded px-8 py-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <form className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="password"
            placeholder="Senha"
            className="w-full border px-3 py-2 rounded"
          />
          <button className="w-full bg-blue-600 text-white px-3 py-2 rounded">
            Entrar
          </button>
        </form>
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
