import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";

export default function Profile() {
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
                    <h2 className="profile-name">Luan Alves</h2>
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
                    <form className="space-y-4">
                        <div>
                            <label className="profile-label">Nome</label>
                            <input type="text" placeholder="Seu nome" defaultValue="Luan Alves" className="profile-input" />
                        </div>
                        <div>
                            <label className="profile-label">Email</label>
                            <input type="email" placeholder="Seu email" defaultValue="luan@email.com" className="profile-input" />
                        </div>
                        <div>
                            <label className="profile-label">Nova Senha</label>
                            <input type="password" placeholder="Nova senha" className="profile-input" />
                        </div>
                        <button type="submit" className="profile-save">Salvar Alterações</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
