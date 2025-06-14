// src/lang/lang.service.ts
import { Injectable } from '@nestjs/common';
import * as pt_BR from './locales/pt_BR.json';

@Injectable()
export class LangService {
    private readonly messages = pt_BR; // fixo em pt_BR, mas pode trocar dinamicamente

    get(path: string): string {
        const keys = path.split('.');
        let result: any = this.messages;
        for (const key of keys) {
            result = result?.[key];
            if (result === undefined) break;
        }
        return result ?? path; // fallback: retorna a key se não encontrar
    }
}
