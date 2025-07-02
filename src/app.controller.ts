import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { OkInterceptor } from './modules/common/interceptors/ok.interceptor';

@Controller()
@UseInterceptors(OkInterceptor)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  healthCheck(): string {
    return this.appService.healthCheck();
  }
}
