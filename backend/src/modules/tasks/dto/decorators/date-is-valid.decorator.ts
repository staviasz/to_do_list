import {
  Validate,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsValidFutureDateFormat', async: false })
export class IsValidFutureDateFormatConstraint
  implements ValidatorConstraintInterface
{
  validate(value: string): boolean {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(value)) {
      return false;
    }

    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(year, month - 1, day);

    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return false;
    }

    const now = new Date();
    now.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    return date >= now;
  }

  defaultMessage(args?: ValidationArguments): string {
    return `${args?.property} deve ser uma data válida e futura no formato YYYY-MM-DD.`;
  }
}

export function IsValidFutureDate(validationOptions?: ValidationOptions) {
  return function (object: any, property: string) {
    Validate(IsValidFutureDateFormatConstraint, validationOptions)(
      object,
      property,
    );
  };
}
