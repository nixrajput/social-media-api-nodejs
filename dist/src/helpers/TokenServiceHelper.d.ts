import type { IAuthTokenModel } from "../interfaces/entities/authToken";
declare class TokenServiceHelper {
    static verifyToken(token: string): Promise<IAuthTokenModel | null>;
    static isTokenExpired(expiresAt: number): Promise<boolean>;
}
export default TokenServiceHelper;
