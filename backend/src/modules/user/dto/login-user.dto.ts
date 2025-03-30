import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @IsEmail(
    {},
    {
      message: 'O email deve ser um email válido.',
    },
  )
  email!: string;

  @IsString({
    message: 'A senha deve ser uma string.',
  })
  @MinLength(6, {
    message: 'A senha deve ter pelo menos 6 caracteres.',
  })
  @MaxLength(100, {
    message: 'A senha deve ter no máximo 100 caracteres.',
  })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{1,}$/, {
    message:
      'A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula e um número.',
  })
  password!: string;
}
