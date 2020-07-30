export class ValidationError {
    private readonly field: string;
    private readonly message: string;
    private readonly code: number;

    constructor (builder: ValidationErrorBuilder) {
        this.field = builder.field;
        this.message = builder.message;
        this.code = builder.code;
    }

    getField (): string {
        return this.field;
    }

    getMessage (): string {
        return this.message;
    }

    static newBuilder (): ValidationErrorBuilder {
        return new ValidationErrorBuilder();
    }
}

class ValidationErrorBuilder {
    field: string;
    message: string;
    code: number;

    withField (field: string): ValidationErrorBuilder {
        this.field = field;
        return this;
    }

    withMessage (message: string): ValidationErrorBuilder {
        this.message = message;
        return this;
    }

    withCode (code: number): ValidationErrorBuilder {
        this.code = code;
        return this;
    }

    build (): ValidationError {
        return new ValidationError(this);
    }
}
