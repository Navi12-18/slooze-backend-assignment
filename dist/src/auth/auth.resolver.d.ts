import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import { LoginResponse } from './models/auth.models';
export declare class AuthResolver {
    private readonly auth;
    constructor(auth: AuthService);
    login(input: LoginInput): Promise<LoginResponse>;
}
