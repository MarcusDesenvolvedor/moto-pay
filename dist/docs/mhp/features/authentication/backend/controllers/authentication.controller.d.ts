import { AuthenticationService } from '../application/authentication.service';
import { SignupDto } from '../dto/signup.dto';
import { LoginDto } from '../dto/login.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { CurrentUserPayload } from '../decorators/current-user.decorator';
export declare class AuthenticationController {
    private readonly authenticationService;
    constructor(authenticationService: AuthenticationService);
    signup(signupDto: SignupDto): Promise<{
        data: AuthResponseDto;
    }>;
    login(loginDto: LoginDto): Promise<{
        data: AuthResponseDto;
    }>;
    refresh(refreshTokenDto: RefreshTokenDto): Promise<{
        data: AuthResponseDto;
    }>;
    logout(refreshTokenDto: RefreshTokenDto): Promise<{
        data: {
            message: string;
        };
    }>;
    getCurrentUser(user: CurrentUserPayload): Promise<{
        data: UserResponseDto;
    }>;
}
