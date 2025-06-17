/**
 * @file src/pages/index.js
 * @description Centraliza exportações das páginas principais da aplicação.
 * @project Desafio Conéctar
 * 
 * @author Luan Alves
 * @github https://github.com/luannsr12
 * @license MIT
 * @created 2025-06-17
 */

//////////////////////////////
// Authentication pages     //
//////////////////////////////

export {
    Register,
    Login,
    Logout
} from './(auth)';

//////////////////////////////
// User regular pages       //
//////////////////////////////

export {
    Profile
} from './(user)';

//////////////////////////////
// Administration pages     //
//////////////////////////////

export {
    AdminUsers
} from './(admin)';
