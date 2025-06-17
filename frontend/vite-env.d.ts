/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly API_ADDRESS: string;
    // adicione outras variáveis públicas aqui se precisar
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
