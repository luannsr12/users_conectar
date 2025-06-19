// ./routesConfig.ts
import {
    Login,
    Logout,
    Register,
    Profile,
    AdminUsers,
} from './pages';
import { RouteConfig } from './types/enum';

/**
 * Configuração centralizada de rotas da aplicação
 * 
 * Organiza as rotas em três categorias principais:
 * - Públicas: Acessíveis sem autenticação
 * - Privadas: Requerem autenticação do usuário
 * - Admin: Requerem privilégios administrativos
 * 
 * Estrutura padrão para cada rota:
 * @property {string} path - Caminho da URL
 * @property {React.ComponentType} element - Componente React a ser renderizado
 */
export const routes: RouteConfig = {
    /**
     * Rotas públicas - Acessíveis por qualquer usuário
     */
    public: [
        { path: '/', element: Login },
        { path: '/auth/login', element: Login },
        { path: '/auth/logout', element: Logout },
        { path: '/auth/register', element: Register },
    ],

    /**
     * Rotas privadas - Requerem autenticação básica
     */
    private: [
        { path: '/user/profile', element: Profile },
    ],

    /**
     * Rotas administrativas - Requerem role de admin
     */
    admin: [
        { path: '/admin/users', element: AdminUsers },
        { path: '/admin/profile', element: Profile },
    ],
};