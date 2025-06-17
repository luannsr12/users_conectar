// src/cli/generate-admin.command.ts
import { Command, CommandRunner, Option } from 'nest-commander';
import { SeederService } from '../modules/seeder/seeder.service';

interface GenerateAdminOptions {
    password?: string;
}

@Command({
    name: 'generate:admin',
    description: 'Cria um admin com senha padrão ou customizada',
})
export class GenerateAdminCommand extends CommandRunner {
    constructor(private readonly seederService: SeederService) {
        super();
    }

    async run(passedParam: string[], options?: GenerateAdminOptions): Promise<void> {
        const password = options?.password || 'admin123';
        await this.seederService.createAdmin(password);
    }

    @Option({
        flags: '--password <password>',
        description: 'Senha do admin',
    })
    parsePassword(val: string): string {
        return val;
    }
}
