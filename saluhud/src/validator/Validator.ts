import ValidationFailure from "@src/validator/ValidationFailure";

/**
 * Validator is a common interface intended for object validation. Its purpose is to validate
 * an entire object alongside all its properties.
 * 
 * @author Saúl Rodríguez Naranjo
 */
export default interface Validator<Type>
{
    /**
     * Validates the object passed by parameter.
     * 
     * @param {Type} object The object to be validated.
     * @returns {Set<ValidationFailure<Type>>} A set containing all validation failures found. 
     * It may be empty if there are no validation errors.
     */
    validate(object: Type) : Set<ValidationFailure<Type>>;

    validateField(fieldName: string, fieldValue: any) : ValidationFailure<Type> | undefined;
}