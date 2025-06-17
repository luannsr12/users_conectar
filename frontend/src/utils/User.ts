import MD5 from "crypto-js/md5";

/**
 * Gera status para cada usuário de acordo com regras de login.
 * @param {Array} users - Array de usuários com { last_login, createdAt }
 * @returns {Array} Novo array com campo `status` definido: "online", "offline", "active", "inactive"
 */
export function statusUser(users) {
    const now = new Date();

    return users.map((user) => {
        let status;

        const lastLogin = user.last_login ? new Date(user.last_login) : null;
        const createdAt = new Date(user.createdAt);

        if (!lastLogin) {
            // Nunca logou → active ou inactive se criado há +30 dias
            const daysSinceCreated = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
            status = daysSinceCreated > 30 ? "inactive" : "active";
        } else {
            // Já logou → regra normal
            const minsSinceLogin = (now.getTime() - lastLogin.getTime()) / (1000 * 60);
            const hoursSinceLogin = minsSinceLogin / 60;
            const daysSinceLogin = hoursSinceLogin / 24;

            if (minsSinceLogin <= 25) {
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
