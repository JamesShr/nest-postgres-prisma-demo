import { Injectable } from '@nestjs/common';
import { INFO_VERSION } from './config';

@Injectable()
export class AppService {
  healthCheck(): string {
    return INFO_VERSION;
  }
}
