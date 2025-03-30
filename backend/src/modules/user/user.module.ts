import { Module } from '@nestjs/common';
import { HashAdapter } from './infra/hash.adapter';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [HashAdapter, UserService],
})
export class UserModule {}
