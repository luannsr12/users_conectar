// src/main.cli.ts
import { CommandFactory } from 'nest-commander';
import { CliModule } from './cli/cli.module';

async function bootstrap() {
    await CommandFactory.run(CliModule, {
        logger: ['log', 'error', 'warn', 'debug', 'verbose'], // ⚡ mostra logs do Nest!
    }).catch(err => {
        console.error('❌ CLI falhou:', err);
        process.exit(1);
    });
}

bootstrap();
