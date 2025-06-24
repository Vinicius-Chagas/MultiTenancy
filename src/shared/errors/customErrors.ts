import {
  ConflictException,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

export class CustomErrors {
  private entity: string;

  constructor(entity: string) {
    this.entity = entity;
  }

  notFound(identifier: number, message?: string): NotFoundException {
    return new NotFoundException(
      message ?? `${this.entity} com id ${identifier} não encontrado(a).`,
    );
  }

  internalServerError(): InternalServerErrorException {
    return new InternalServerErrorException(`Erro ao processar ${this.entity}.`);
  }

  deleteError(id: number): InternalServerErrorException {
    return new InternalServerErrorException(`Erro ao deletar ${this.entity} de id ${id}.`);
  }

  createError(): InternalServerErrorException {
    return new InternalServerErrorException(`Erro ao tentar criar ${this.entity}.`);
  }

  updateServerError(id: number): InternalServerErrorException {
    return new InternalServerErrorException(`Erro ao atualizar ${this.entity} de id ${id}.`);
  }

  unauthorized(message?: string): ConflictException {
    return new UnauthorizedException(message ?? `Acesso negado.`);
  }

  duplicateError(id: number, message?: string): ConflictException {
    return new ConflictException(message ?? `${this.entity} com id ${id} já existe.`);
  }

  async handleServiceMethod<T>(
    operation: () => Promise<T>,
    action?: 'create' | 'update' | 'delete' | 'custom' | 'retrow',
    identifier?: number | string,
    custom?: HttpException,
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      console.error(error);
      if (action === 'retrow') throw error;

      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }

      switch (action) {
        case 'create':
          throw this.createError();
        case 'update':
          throw this.updateServerError(Number(identifier) || 0);
        case 'delete':
          throw this.deleteError(Number(identifier) || 0);
        case 'custom':
          if (custom) throw custom;
          throw this.internalServerError();
        default:
          throw this.internalServerError();
      }
    }
  }
}
