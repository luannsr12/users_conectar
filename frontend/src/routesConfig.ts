import { RouteConfig } from './types/enum'

import {
    Login,
    Logout,
    Register,
    Profile,
    AdminUsers
} from './pages';

export const routes: RouteConfig[] = [

    //Paginas de acesso publico
    { path: '/', element: Login, isPublic: true },
    { path: '/auth/login', element: Login, isPublic: true },
    { path: '/auth/logout', element: Logout, isPublic: true },
    { path: '/auth/register', element: Register, isPublic: true },


    //Paginas de acesso restrito
    { path: '/user/profile', element: Profile, isPublic: false },

    // Paginas administrativa
    { path: '/admin/users', element: AdminUsers, isPublic: false },
    { path: '/admin/profile', element: Profile, isPublic: false },
    
];