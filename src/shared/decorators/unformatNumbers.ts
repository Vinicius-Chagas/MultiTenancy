import { Transform } from 'class-transformer';

/**
 * Custom decorator removes all formatation from numbers Ex.:
 *
 * CPF -> 162.913.330-23 -> 162.913.330-23
 *
 * CNPJ -> 12.345.678/0001-95 -> 12345678000195
 *
 * Telefone -> (11) 91234-5678 -> 11912345678
 *
 * CEP -> 12345-678 -> 12345678
 */
export function UnformatNumbers() {
  return Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.replace(/\D/g, '');
    }
    return value;
  });
}
