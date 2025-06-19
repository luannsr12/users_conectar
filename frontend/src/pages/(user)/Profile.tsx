import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { apiHttp } from "../../utils/api";
import { useMessageStore, MomentMessage } from "../../stores/useMessageStore";
import { formatDateToBR, getGravatarUrl } from "../../utils/User";
import { useAuthStore } from "../../stores/useAuthStore";
import { ContextUpdate } from "../../types/enum";
import Gravatar from 'react-gravatar'

export default function Profile() {
    const { user,
        setName: setNameStore,
        setEmail: setEmailStore
    } = useAuthStore();
    const { update, loading, error, setError } = apiHttp();
    const [loadingSave, setLoadingSave] = useState(false);
    const [name, setName] = useState(user?.name ?? "");
    const [email, setEmail] = useState(user?.email ?? "");
    const [password, setPassword] = useState("");
    const [confirm_password, setConfirm_password] = useState("");
    const { setMessage } = useMessageStore();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (loadingSave || loading) return;

        setLoadingSave(true);

        try {

            const context: ContextUpdate = {
                origin: "profile",
                userRequest: {
                    id: user?.id ?? '',
                    role: user?.role ?? 'user'
                },
                userId: user?.id ?? ''
            };
            
            const response = await update({
                name,
                email,
                password,
                confirm_password,
                role: user?.role
            }, context);

            if (response?.success) {

                setMessage({
                    'type': 'success',
                    'message': "Dados atualizados!"
                } as MomentMessage);

                setNameStore(response?.name ?? user?.name);
                setEmailStore(response?.email ?? user?.email);

                return true;

            }

            setMessage({
                'type': 'error',
                'message': `${response?.message || 'Desculpe, tente novamente mais tarde'}`
            } as MomentMessage);

            return false;

        } catch (err) {
            setMessage({
                'type': 'error',
                'message': `${err || 'Desculpe, tente novamente mais tarde'}`
            } as MomentMessage);
        } finally {
            setLoadingSave(false);
        }
    }


    return (
        <div className="darkprofile-page ">
            {/* Capa */}
            <div className="profile-cover"></div>

            <div className="mx-auto profile-container">
                {/* Card principal */}
                <div className="profile-card card">
                    <div className="profile-avatar-wrapper">
                       
                        <Gravatar 
                            email={user?.email}
                            size={150} 
                            rating="pg" 
                            default="monsterid" 
                            className="profile-avatar" 
                        />

                        <button className="btn-picture-profile" >
                            <FontAwesomeIcon className='icon-picture-profile' icon={faCamera} size="sm" />
                        </button>
                    </div>
                    <h3 className="profile-name te">{user?.name ?? 'Username'}</h3>
                    <div className="profile-bio" >
                        <p>
                         Aqui descreva sua biografia ☕️
                        </p>
                        <p >
                            Conta criada em {formatDateToBR(user?.createdAt ?? '')}
                        </p>
                    </div>

                </div>

                {/* Card de edição */}
                <div className="profile-edit-card card">
                    <h3 className="profile-edit-title">Editar Perfil</h3>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>

                            <label className="profile-label">Nome</label>
                            <input
                                onChange={(e) => setName(e.target.value)}
                                type="text"
                                placeholder="Seu nome"
                                defaultValue={user?.name ?? ''}
                                className="profile-input"
                            />

                        </div>
                        <div>

                            <label className="profile-label">Email</label>
                            <input
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                placeholder="Seu email"
                                defaultValue={user?.email ?? ''}
                                className="profile-input"
                            />

                        </div>
                      
                      
                        <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-start">
                            <div className="w-full md:flex-1">
                                <label className="profile-label">Nova Senha</label>
                                <input
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    type="password"
                                    placeholder="Nova senha"
                                    className="profile-input w-full" />
                            </div>

                            <div className="w-full md:flex-1">
                                <label className="profile-label">Confirmar senha</label>
                                <input
                                    value={confirm_password}
                                    onChange={(e) => setConfirm_password(e.target.value)}
                                    type="password"
                                    placeholder="Confirmar nova senha"
                                    className="profile-input w-full" />
                            </div>
                        </div>

                        <button type="submit" className="cursor-pointer profile-save">
                            {loadingSave ? "Salvando..." : "Salvar"} Alterações
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
