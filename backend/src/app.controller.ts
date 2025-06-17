import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import pkg from '../package.json';

@ApiTags('App')
@Controller()
export class AppController {
  @Get()
  getRoot() {
    return { message: 'API is running' };
  }

  @Get('version')
  getVersion() {
    return { version: pkg.version };
  }
}
