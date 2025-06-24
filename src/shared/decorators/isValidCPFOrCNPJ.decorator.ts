import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { isValidCPF } from '../validators/validateCpf';
import { isValidCNPJ } from '../validators/validateCnpj';

type DocumentType = 'CPF' | 'CNPJ' | 'ANY';

@ValidatorConstraint()
export class IsValidCPFOrCNPJConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    if (!value) return false;
    const documentType = (args.constraints[0] || 'ANY') as DocumentType;
    const cleanValue: string = value.replace(/\D/g, '');
    if (documentType === 'CPF') {
      return isValidCPF(cleanValue);
    } else if (documentType === 'CNPJ') {
      return isValidCNPJ(cleanValue);
    } else if (documentType === 'ANY') {
      return isValidCPF(cleanValue) || isValidCNPJ(cleanValue);
    }

    return false;
  }

  defaultMessage(args: ValidationArguments) {
    const documentType = (args.constraints[0] || 'ANY') as DocumentType;
    const messageOverride = args.constraints[1];

    if (messageOverride) return messageOverride;

    if (documentType === 'ANY') {
      return 'O valor deve ser um CPF ou CNPJ válido';
    }

    return `O valor deve ser um ${documentType} válido`;
  }
}

/**
 * Custom decorator to validate a CPF or CNPJ.
 * @param documentType - The type of document to validate ('CPF', 'CNPJ', or 'ANY').
 * @param validationOptions - Optional validation options.
 */
export function IsValidCPFOrCNPJ(
  documentType: DocumentType = 'ANY',
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isValidCPFOrCNPJ',
      target: object.constructor,
      propertyName,
      constraints: [documentType, validationOptions?.message],
      options: validationOptions,
      validator: IsValidCPFOrCNPJConstraint,
    });
  };
}
