import MD5 from "crypto-js/md5";
import { FormAccount, User, FormValidationType, ValidationResult, UserWithStatus } from "../types/enum";

/**
 * Gera status para cada usuário de acordo com regras de login.
 * @param {Array} users - Array de usuários com { last_login, createdAt }
 * @returns {Array} Novo array com campo `status` definido: "online", "offline", "active", "inactive"
 */
 
export function statusUser(users: User[]): UserWithStatus[] {
    const now = new Date();

    return users.map((user) => {
        let status: UserWithStatus["status"];

        const lastLogin = user.last_login ? new Date(user.last_login) : null;
        const updatedAt = user.updatedAt ? new Date(user.updatedAt) : null;
        const createdAt = new Date(user.createdAt);

        if (!lastLogin) {
            const daysSinceCreated = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
            status = daysSinceCreated > 30 ? "inactive" : "active";
        } else {
            const minsSinceLogin = (now.getTime() - lastLogin.getTime()) / (1000 * 60);
            const minsSinceUpdate = updatedAt ? (now.getTime() - updatedAt.getTime()) / (1000 * 60) : Infinity;
            const hoursSinceLogin = minsSinceLogin / 60;
            const daysSinceLogin = hoursSinceLogin / 24;

            const isRecentlyActive = minsSinceLogin <= 25;

            if (isRecentlyActive) {
                status = "online";
            } else if (daysSinceLogin > 30) {
                status = "inactive";
            } else if (hoursSinceLogin > 1) {
                status = "active";
            } else {
                status = "offline";
            }
        }

        return {
            ...user,
            status,
        };
    });
}


/**
 * Formata uma data para o formato: ex: 14 de Jun, 2025
 * com timezone do Brasil (America/Sao_Paulo).
 *
 * @param {string | Date} dateInput - A data a ser formatada.
 * @returns {string} Data formatada no estilo brasileiro.
 */
export function formatDateToBR(dateInput: string | Date): string {
    const date = new Date(dateInput);
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        timeZone: 'America/Sao_Paulo',
    }).replace('.', '');
}


/**
 * Gera URL de gravatar a partir do email.
 * @param {String} email
 * @returns {String} URL gravatar
 */
export function getGravatarUrl(email) {
    const hash = MD5(email.trim().toLowerCase()).toString();
    return `https://www.gravatar.com/avatar/${hash}?d=identicon`;
}

/**
 * Ordena um array de usuários por campo e direção.
 * 
 * @param {Array} users - Array de usuários
 * @param {String} field - Campo para ordenar: "createdAt" ou "name"
 * @param {String} direction - "asc" ou "desc"
 * @returns {Array} Novo array ordenado
 */
export function sortUsers(users, field = "createdAt", direction = "asc") {
    const sorted = [...users].sort((a, b) => {
        if (field === "createdAt") {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return dateA.getTime() - dateB.getTime(); // ASC por padrão
        }
        if (field === "name") {
            return a.name.localeCompare(b.name); // ASC por padrão
        }
        return 0; // fallback
    });

    // Se direção for desc, inverte o resultado
    if (direction === "desc") {
        sorted.reverse();
    }

    return sorted;
}

export function getPasswordStrength(password: string): { score: number; label: string } {
    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[\W_]/.test(password)) score++;

    let label = "Fraca";
    if (score >= 4) label = "Forte";
    else if (score === 3) label = "Média";

    return { score, label };
}

export function splitFullName(fullName: string): { name: string; surname: string } {
    const [name, ...surnameParts] = fullName.trim().split(/\s+/);
    const surname = surnameParts.join(' ') || '';
    return { name, surname };
}


export function validadeForm(type: FormValidationType, form: FormAccount | null): ValidationResult {
    const errors: Record<string, string> = {};
    const resultData: Partial<FormAccount> = {};

    if (!form) {
        return { valid: false, errors: { form: 'Os dados do formulário estão faltando' } };
    }

    const { name: fullName, email, password, confirm_password, role } = form;

    // Extrai nome e sobrenome
    const { name, surname: extractedSurname } = splitFullName(fullName || '');
    const surname = form.surname || extractedSurname;

    // Validação de email (quando necessário)
    if (type !== 'forgot-password' && !email) {
        errors.email = 'O e-mail é obrigatório';
    } else if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = 'Informe um e-mail válido';
    } else if (email) {
        resultData.email = email;
    }

    // Validações específicas por tipo
    switch (type) {
        case 'register':
            // Nome completo obrigatório
            if (!name) {
                errors.name = 'O nome é obrigatório';
            } else if (name.length < 3) {
                errors.name = 'O nome deve ter pelo menos 3 caracteres';
            } else {
                resultData.name = name;
            }

            // Sobrenome obrigatório se não for admin
            if (!surname) {
                errors.surname = 'O sobrenome é obrigatório';
            }

            // Validação forte de senha
            if (!password) {
                errors.password = 'A senha é obrigatória';
            } else if (!/^(?=.*\d).{6,}$/.test(password)) {
                errors.password = 'A senha deve ter pelo menos 6 caracteres e pelo menos um número';
            }

            // Confirmação de senha
            if (!confirm_password) {
                errors.confirm_password = 'Por favor confirme sua senha';
            } else if (password !== confirm_password) {
                errors.confirm_password = 'As senhas não correspondem';
            }
            break;

        case 'login':
            // Validação de senha para login
            if (!password) {
                errors.password = 'A senha é obrigatória';
            }
            break;

        case 'update':
            // Nome
            if (name) {
                if (name.length < 3) {
                    errors.name = 'O nome deve ter pelo menos 3 caracteres';
                } else {
                    resultData.name = name;
                }
            }

            // Sobrenome se não for admin
            if (role !== 'admin' && surname) {
                resultData.surname = surname;
            } else if (role !== 'admin' && !surname) {
                errors.surname = 'O sobrenome é obrigatório';
            }

            // Senha opcional, mas se for preenchida, deve ser válida
            if (password) {
                if (!/^(?=.*\d).{6,}$/.test(password)) {
                    errors.password = 'A senha deve ter pelo menos 6 caracteres e pelo menos um número';
                } else {
                    // Só inclui a senha no resultado se foi alterada
                    resultData.password = password;
                }

                if (!confirm_password) {
                    errors.confirm_password = 'Por favor confirme sua nova senha';
                } else if (password !== confirm_password) {
                    errors.confirm_password = 'Senhas conflitantes';
                }
            }
            break;

        case 'forgot-password':
            // Apenas email é necessário
            break;

        default:
            errors.type = 'Tipo de formulário inválido';
    }

    const isValid = Object.keys(errors).length === 0;
    const cleanData = { ...resultData };
    delete cleanData.role;

    return {
        valid: isValid,
        errors,
        data: isValid ? cleanData as Omit<FormAccount, 'confirm_password'> : undefined
    };
}
