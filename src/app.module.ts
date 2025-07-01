import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { PostModule } from './modules/post/post.module';
import { CommonModule } from './modules/common/common.module';
import { RecordModule } from './modules/record/record.module';
import { TagModule } from './modules/tag/tag.module';

@Module({
  imports: [UserModule, PostModule, CommonModule, RecordModule, TagModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
