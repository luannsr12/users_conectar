'use client'

import { useState, useEffect } from 'react'
import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    DialogTitle
} from '@headlessui/react'
import {
    ContextUpdate,
    ContextRegister,
    UserRegister,
    User,
    AuthState,
    Password,
    UpdateProfile
} from '../../types/enum'
import { showToast } from '../../utils/swal'
import { apiHttp } from '../../utils/api'
import { MomentMessage, useMessageStore } from '../../stores/useMessageStore'
import { useAuthStore } from '../../stores/useAuthStore'

type ModalProps = {
    open: boolean,
    onClose: () => void;
    onAddUser: (user: User) => void;
    onEditUser: (user: User) => void;
    existingUsers: User[],
    user: User | null | undefined
}

export default function ModalUser({
    open,
    onClose,
    onAddUser,
    onEditUser,
    existingUsers,
    user
}: ModalProps) {
    const { setMessage } = useMessageStore()
    const { user: userLogged } = useAuthStore() as AuthState
    const { update, register, loading } = apiHttp()
    const [loadingForm, setLoadingForm] = useState<boolean>(false)
    const [name, setName] = useState<User["name"]>("")
    const [role, setRole] = useState<User["role"]>("user")
    const [email, setEmail] = useState<User["email"]>("")
    const [password, setPassword] = useState<Password>("")
    const [confirm_password, setConfirmPassword] = useState<Password>("")
    const [error, setError] = useState<string | null>("")

    // Preenche campos se for editar
    useEffect(() => {
        if (user) {
            setName(user.name || "")
            setEmail(user.email || "")
        } else {
            resetForm()
        }
    }, [user, open])

    const resetForm = () => {
        setName("")
        setEmail("")
        setPassword("")
        setConfirmPassword("")
        setError("")
    }


    const handleSubmit = async () => {

        if (loading || loadingForm || !user) return;

        setLoadingForm(true);

        try {

            // Evitar email duplicado em outro user
            if (existingUsers.some(u => u.email === email && (!user || u.id !== user.id))) {
                showToast("error", "Email já existe.");
                return;
            }

            let response;

            if (user) {

                const contextUpdate: ContextUpdate = {
                    origin: "table",
                    userRequest: {
                        id: userLogged?.id ?? '',
                        role: userLogged?.role ?? 'user'
                    },
                    userId: user?.id ?? ''
                };

                response = await update({
                    name,
                    email,
                    password,
                    confirm_password,
                    role: user?.role
                } as UpdateProfile, contextUpdate);

            } else {

                const contextRegister: ContextRegister = {
                    origin: "table",
                    userRequest: {
                        id: userLogged?.id ?? '',
                        role: userLogged?.role ?? 'user'
                    }
                };

                response = await register({
                    name,
                    email,
                    password,
                    confirm_password,
                    role: role ?? 'user'
                } as UserRegister, contextRegister);

            }

            if (response?.success) {

                const userData = { ...response };
                delete userData.success;

                if (user) {
                    // Edição

                    onEditUser(userData);

                    setMessage({
                        'type': 'success',
                        'message': "Usuário editado com sucesso!"
                    } as MomentMessage);

                } else {
                    // Criação

                    const newUser: User = userData;

                    onAddUser(newUser);

                    setMessage({
                        'type': 'success',
                        'message': "Usuário criado com sucesso!"
                    } as MomentMessage);
                }
            } else {
                setMessage({
                    'type': 'error',
                    'message': `${response?.message || 'Desculpe, tente novamente mais tarde'}`
                } as MomentMessage);
            }

        } catch (err) {
            setMessage({
                'type': 'error',
                'message': `${err || 'Desculpe, tente novamente mais tarde'}`
            } as MomentMessage);
        } finally {
            setLoadingForm(false);
        }

        resetForm();
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} className="relative z-50">
            <DialogBackdrop className="fixed inset-0 bg-black/40 backdrop-blur-sm" />

            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <DialogPanel className="card w-full max-w-lg transform overflow-hidden rounded-lg bg-white shadow-xl transition-all">
                    <div className="px-6 py-4">
                        <DialogTitle as="h3" className="card text-lg font-bold text-gray-900">
                            {user ? "Editar Usuário" : "Adicionar Novo Usuário"}
                        </DialogTitle>

                        <div className="mt-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nome
                                </label>
                                <input
                                    type="text"
                                    className="w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    placeholder="ex: Daenerys Targaryen"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    className="w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="email@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Senha
                                    {user && (
                                        <span className="text-xs text-gray-500 ml-1">
                                            (Deixe em branco para não alterar)
                                        </span>
                                    )}
                                </label>
                                <input
                                    type="password"
                                    className="w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="******"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Confirmar Senha
                                </label>
                                <input
                                    type="password"
                                    className="w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    placeholder="******"
                                />
                            </div>

                            {error && (
                                <p className="text-red-600 text-sm">{error}</p>
                            )}
                        </div>
                    </div>

                    <div className="card bg-gray-50 px-6 py-3 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => {
                                resetForm()
                                onClose()
                            }}
                            className="cursor-pointer rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                            Fechar
                        </button>
                        
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                            {loadingForm
                                ? (user ? "Salvando..." : "Adicionando...")
                                : (user ? "Salvar Alterações" : "Adicionar")}
                            
                        </button>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    )
}
