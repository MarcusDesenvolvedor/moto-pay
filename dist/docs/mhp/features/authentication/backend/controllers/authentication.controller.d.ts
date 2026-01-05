import { AuthenticationService } from '../application/authentication.service';
import { SignupDto } from '../dto/signup.dto';
import { LoginDto } from '../dto/login.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UpdatePasswordDto } from '../dto/update-password.dto';
import { UploadAvatarDto } from '../dto/upload-avatar.dto';
import { ChangePasswordDto } from '../../../security/backend/dto/change-password.dto';
import { SessionResponseDto } from '../../../security/backend/dto/session-response.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { RefreshResponseDto } from '../dto/refresh-response.dto';
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
        data: RefreshResponseDto;
    }>;
    logout(refreshTokenDto: RefreshTokenDto): Promise<{
        data: {
            message: string;
        };
    }>;
    getCurrentUser(user: CurrentUserPayload): Promise<{
        data: UserResponseDto;
    }>;
    updateProfile(user: CurrentUserPayload, updateUserDto: UpdateUserDto): Promise<{
        data: UserResponseDto;
    }>;
    updatePassword(user: CurrentUserPayload, updatePasswordDto: UpdatePasswordDto): Promise<{
        data: {
            message: string;
        };
    }>;
    changePassword(user: CurrentUserPayload, changePasswordDto: ChangePasswordDto): Promise<{
        data: {
            message: string;
        };
    }>;
    getSessions(user: CurrentUserPayload): Promise<{
        data: SessionResponseDto[];
    }>;
    logoutAllSessions(user: CurrentUserPayload): Promise<{
        data: {
            message: string;
        };
    }>;
    logoutSession(user: CurrentUserPayload, sessionId: string): Promise<{
        data: {
            message: string;
        };
    }>;
    uploadAvatar(user: CurrentUserPayload, uploadAvatarDto: UploadAvatarDto): Promise<{
        data: UserResponseDto;
    }>;
}
