export default interface ValidationFailure<Type>
{
    readonly fieldName: string;
    readonly message: string;
    readonly fieldValue: any;
}