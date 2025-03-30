import { IsString } from 'class-validator';

export class RefreshSessionDto {
  @IsString({
    message: 'O token deve ser uma string.',
  })
  token!: string;

  @IsString({
    message: 'O refresh token deve ser uma string.',
  })
  refreshToken!: string;
}
