declare class Validators {
    static validateEmail(email: string): boolean;
    static validateUsername(username: string): boolean;
    static validatePhone(phone: string): boolean;
    static validateUrl(url: string): boolean;
    static validateLinkedUrl(url: string): boolean;
}
export default Validators;
