export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainError';
  }
}

export class ProductNotFoundError extends DomainError {
  constructor(id: string) {
    super(`Producto con ID ${id} no encontrado`);
    this.name = 'ProductNotFoundError';
  }
}

export class InsufficientStockError extends DomainError {
  constructor(ingredientName: string) {
    super(`Stock insuficiente de: ${ingredientName}`);
    this.name = 'InsufficientStockError';
  }
}

export class CashRegisterClosedError extends DomainError {
  constructor() {
    super('No hay una caja abierta. Por favor, abre la caja primero.');
    this.name = 'CashRegisterClosedError';
  }
}

export class DuplicateEmailError extends DomainError {
  constructor() {
    super('Este correo electrónico ya está registrado');
    this.name = 'DuplicateEmailError';
  }
}

export class InvalidCredentialsError extends DomainError {
  constructor() {
    super('Credenciales incorrectas');
    this.name = 'InvalidCredentialsError';
  }
}

export class ValidationError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}
