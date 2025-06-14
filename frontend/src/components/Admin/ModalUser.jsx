'use client'

import { useState, useEffect } from 'react'
import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    DialogTitle
} from '@headlessui/react'
import { showToast } from '../../utils/swal'

export default function ModalUser({
    open,
    onClose,
    onAddUser,
    onEditUser,
    existingUsers,
    user // se receber user -> modo edição
}) {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")

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

    const validateEmail = (email) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

    const handleSubmit = () => {
        if (!name.trim()) {
            showToast("error", "Nome é obrigatório.");
            return;
        }
        if (!validateEmail(email)) {
            showToast("error", "Email inválido.");
            return;
        }
        // Evitar email duplicado em outro user
        if (existingUsers.some(u => u.email === email && (!user || u.id !== user.id))) {
            showToast("error", "Email já existe.");
            return;
        }

        // 🟢 Lógica da senha:
        if (!user) {
            // Modo Adicionar: senha é obrigatória
            if (password.length < 4) {
                showToast("error", "Senha muito curta.");
                return;
            }
            if (password !== confirmPassword) {
                showToast("error", "Senhas não conferem.");
                return;
            }
        } else {
            // Modo Editar: valida só se foi digitada
            if (password) {
                if (password.length < 4) {
                    showToast("error", "Senha muito curta.");
                    return;
                }
                if (password !== confirmPassword) {
                    showToast("error", "Senhas não conferem.");
                    return;
                }
            }
        }

        if (user) {
            // Edição
            const updatedUser = {
                ...user,
                name,
                email,
                ...(password && { password }), // só atualiza se foi digitada
                updatedAt: new Date().toISOString(),
            };
            onEditUser(updatedUser);
            showToast("success", "Usuário editado com sucesso!");
        } else {
            // Criação
            const newUser = {
                id: Date.now(),
                name,
                email,
                role: "user",
                password,
                last_login: null,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            onAddUser(newUser);
            showToast("success", "Usuário adicionado com sucesso!");
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
                                    value={password}
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
                                    value={confirmPassword}
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
                            className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                            {user ? "Salvar Alterações" : "Adicionar"}
                        </button>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    )
}
