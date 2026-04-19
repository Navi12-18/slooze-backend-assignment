import { UsersService } from './users.service';
import { UserModel } from './models/user.model';
import type { AuthUser } from '../common/types/auth-user';
export declare class UsersResolver {
    private readonly users;
    constructor(users: UsersService);
    me(user: AuthUser): Promise<UserModel>;
}
