import {
  Validate,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsNotEmptyTrimConstraint', async: false })
export class IsNotEmptyTrimConstraint implements ValidatorConstraintInterface {
  validate(value: string): boolean {
    return !!value.trim();
  }

  defaultMessage(args?: ValidationArguments): string {
    return `${args?.property} deve ser uma data válida e futura no formato YYYY-MM-DD.`;
  }
}

export function IsNotEmptyTrim(validationOptions?: ValidationOptions) {
  return function (object: any, property: string) {
    Validate(IsNotEmptyTrimConstraint, validationOptions)(object, property);
  };
}
