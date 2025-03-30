import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JWTAdapter } from './infra/jwt.adapter';

@Global()
@Module({
  providers: [AuthService, JWTAdapter],
  exports: [AuthService],
})
export class AuthModule {}
