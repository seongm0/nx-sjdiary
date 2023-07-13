import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  healthCheck(): string {
    return 'Server Live';
  }

  getVersion(): string {
    return '0.0.1';
  }
}
