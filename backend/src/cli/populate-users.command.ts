// src/cli/populate-users.command.ts
import { Command, CommandRunner } from 'nest-commander';
import { SeederService } from '../modules/seeder/seeder.service';

@Command({
    name: 'populate:users',
    description: 'Popula o banco com usuários aleatórios',
})
export class PopulateUsersCommand extends CommandRunner {
    constructor(private readonly seederService: SeederService) {
        super();
    }

    async run(): Promise<void> {
        await this.seederService.createRandomUsers(20); // 👈 Aqui chama DIRETO o método!
    }
}
