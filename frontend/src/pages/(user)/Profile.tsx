import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../contexts/AuthContext";
import { useState } from "react";
import { apiHttp } from "../../utils/api";
import { useMessageStore, MomentMessage } from "../../stores/useMessageStore";

export default function Profile() {
    const { user } = useAuth();
    const { update, loading, error, setError } = apiHttp();
    const [loadingSave, setLoadingSave] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm_password, setConfirm_password] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const { setMessage } = useMessageStore();

        try {

            const token = await update({
                name,
                email,
                password,
                confirm_password
            });

            if (typeof token === 'string') {

                if (token) {
                    const payload = JSON.parse(atob((token as string).split('.')[1]));
                    const role = payload?.role || "user";

                    setMessage({
                        'type': 'success',
                        'message': "Login bem sucedido!"
                    } as MomentMessage);

                }

            }

        } catch (err) {
            console.error(err);
        }
    }


    return (
        <div className="darkprofile-page ">
            {/* Capa */}
            <div className="profile-cover"></div>

            <div className="profile-container">
                {/* Card principal */}
                <div className="profile-card card">
                    <div className="profile-avatar-wrapper">
                        <img
                            src="https://i.pravatar.cc/150?img=3"
                            alt="Avatar"
                            className="profile-avatar"
                        />
                        <button className="btn-picture-profile" >
                            <FontAwesomeIcon className='icon-picture-profile' icon={faCamera} size="sm" />
                        </button>
                    </div>
                    <h2 className="profile-name">{user?.name ?? 'Username'}</h2>
                    <div className="profile-bio" >
                        <p>
                            Desenvolvedor apaixonado por tecnologia, UX e café ☕️.
                        </p>
                        <p >
                            Conta criada em 14 de Jun, 2025
                        </p>
                    </div>

                </div>

                {/* Card de edição */}
                <div className="profile-edit-card card">
                    <h3 className="profile-edit-title">Editar Perfil</h3>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="profile-label">Nome</label>
                            <input type="text" placeholder="Seu nome" defaultValue={user?.name ?? ''} className="profile-input" />
                        </div>
                        <div>
                            <label className="profile-label">Email</label>
                            <input type="email" placeholder="Seu email" defaultValue={user?.email ?? ''} className="profile-input" />
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                gap: 10,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                            }}
                        >
                            <div style={{ flex: 1 }}>
                                <label className="profile-label">Nova Senha</label>
                                <input
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    type="password"
                                    placeholder="Nova senha"
                                    className="profile-input" />
                            </div>

                            <div style={{ flex: 1 }}>
                                <label className="profile-label">Confirmar senha</label>
                                <input
                                    value={confirm_password}
                                    onChange={(e) => setConfirm_password(e.target.value)}
                                    type="password"
                                    placeholder="Confirmar nova senha"
                                    className="profile-input" />
                            </div>
                        </div>

                        <button type="submit" className="profile-save">
                            {loadingSave ? "Salvando..." : "Salvar"} Alterações
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
