class AppError extends Error {
  constructor(message, statusCode = 500, code = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFoundError extends AppError {
  constructor(resource = 'Recurso') {
    super(`${resource} não encontrado.`, 404);
  }
}

class ValidationError extends AppError {
  constructor(message, code = null) {
    super(message, 400, code);
  }
}

class ConflictError extends AppError {
  constructor(message) {
    super(message, 409);
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Credenciais inválidas.') {
    super(message, 401);
  }
}

class ForbiddenError extends AppError {
  constructor(message = 'Acesso negado.') {
    super(message, 403);
  }
}

function handleDBError(err, res) {
  if (err.message.includes('UNIQUE constraint')) {
    return new ConflictError('Registro duplicado.');
  }
  if (err.message.includes('FOREIGN KEY constraint')) {
    return new ValidationError('Referência inválida.');
  }
  return new AppError('Erro interno do banco de dados.', 500);
}

module.exports = {
  AppError,
  NotFoundError,
  ValidationError,
  ConflictError,
  UnauthorizedError,
  ForbiddenError,
  handleDBError
};