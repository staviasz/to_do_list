import { IsString, Length, MaxLength, MinLength } from 'class-validator';
import { IsValidFutureDate } from './decorators/date-is-valid.decorator';
import { IsNotEmptyTrim } from './decorators/trim.decorator';

export class CreateTaskDto {
  @IsString({
    message: 'A descrição deve ser uma string.',
  })
  @MinLength(3, {
    message: 'A descrição deve ter pelo menos 3 caracteres.',
  })
  @MaxLength(255, {
    message: 'A descrição deve ter no máximo 255 caracteres.',
  })
  @IsNotEmptyTrim({
    message: 'A descrição deve ser preenchido.',
  })
  description!: string;

  @IsString({
    message: 'A data de conclusão deve ser uma string no formato YYYY-MM-DD.',
  })
  @Length(10, 10, {
    message: 'A data de conclusão deve ser uma string no formato YYYY-MM-DD.',
  })
  @IsValidFutureDate()
  dateOfCompletion!: string;
}
