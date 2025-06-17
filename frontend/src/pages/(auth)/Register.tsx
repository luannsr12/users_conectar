import { useEffect, useState } from "react";
import { apiHttp } from "../../utils/api";
import { getPasswordStrength } from "../../utils/User"
import GoogleLoginButton from "../../components/GoogleLoginButton";
import { Link, useNavigate } from "react-router-dom";
import { useMessageStore, MomentMessage } from "../../stores/useMessageStore";
import { showToast } from "../../utils/swal";

export default function Register() {
    const navigate = useNavigate();
    const { setMessage } = useMessageStore();
    const { register, loading, error, setError } = apiHttp();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const { score, label } = getPasswordStrength(password);
    const strengthColor =
        score >= 4 ? "bg-green-500" : score === 3 ? "bg-yellow-400" : "bg-red-900";
    const strengthTextColor =
        score >= 4 ? "text-gray-900" : score === 3 ? "text-gray-900" : "text-gray-100";

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        try {
            const success = await register(name, email, password, confirmPassword);
            if (success) {
                setMessage({
                    'type': 'success',
                    'message': "Conta criada com sucesso! Acesse sua conta."
                } as MomentMessage);
                navigate("/auth/login");
            }

            throw Error('Desculpe, não foi possível criar sua conta no momento.');

        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        if(typeof error === 'string'){
            if (error.trim().length > 0){
                showToast('error', `${error}`, 5000);
                setTimeout(() => {
                    setError(null);
                }, 5000);
            }
        }
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="card bg-white shadow-md rounded px-8 py-6 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-3">Criar conta</h2>

                <form className="space-y-4" onSubmit={handleSubmit}>

                    <input
                        type="text"
                        placeholder="Seu nome"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                        required
                    />

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

                    {password && (
                        <div 
                        style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', position: 'relative'}}
                        className="">
                            <div className="h-2 w-full bg-gray-200 rounded">
                                <div
                                    className={`font-medium h-3 pl-2 rounded ${strengthTextColor} ${strengthColor}`}
                                    style={{ width: `${(score / 5) * 100}%`, fontSize: '9px', top: '-2px', position: 'absolute', alignContent: 'center' }}
                                >
                                    {label}
                                </div>
                            </div>

                        </div>
                    )}

                    <input
                        type="password"
                        placeholder="Confirmar senha"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="hover:opacity-80 cursor-pointer w-full bg-purple-700 text-white px-3 py-2 rounded"
                    >
                        {loading ? "Registrando..." : "Registrar"}
                    </button>
                </form>

                {error && (
                    <div className="mt-2 text-red-500 text-sm text-left">{error}</div>
                )}

                <div className="my-4 text-center text-gray-500">ou</div>
                <GoogleLoginButton />

                <p className="mt-4 text-sm text-center">
                    Já tem conta?{" "}
                    <Link to="/auth/login" className="text-purple-400">
                        Acessar Conta
                    </Link>
                </p>
            </div>
        </div>
    );
}
