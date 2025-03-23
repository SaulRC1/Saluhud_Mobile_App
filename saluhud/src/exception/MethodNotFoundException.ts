/**
 * {@link Error} intended to be used when a method implementation is not found within a class or an object.
 * 
 * @author Sa�l Rodr�guez Naranjo
 */
export default class MethodNotFoundException extends Error
{
    constructor(message: string)
    {
        super(message);
        this.name = "MethodNotFoundException";
        Object.setPrototypeOf(this, MethodNotFoundException.prototype);
    }
}