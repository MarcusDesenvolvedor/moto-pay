import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
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
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser, CurrentUserPayload } from '../decorators/current-user.decorator';

@Controller('auth')
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
  ) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() signupDto: SignupDto): Promise<{ data: AuthResponseDto }> {
    const result = await this.authenticationService.signup(signupDto);
    return { data: result };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<{ data: AuthResponseDto }> {
    const result = await this.authenticationService.login(loginDto);
    return { data: result };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<{ data: RefreshResponseDto }> {
    const result = await this.authenticationService.refreshToken(
      refreshTokenDto.refreshToken,
    );
    return { data: result };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Body() refreshTokenDto: RefreshTokenDto): Promise<{ data: { message: string } }> {
    await this.authenticationService.logout(refreshTokenDto.refreshToken);
    return { data: { message: 'Logged out successfully' } };
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async getCurrentUser(
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<{ data: UserResponseDto }> {
    const result = await this.authenticationService.getCurrentUser(user.userId);
    return { data: result };
  }

  @Put('me')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async updateProfile(
    @CurrentUser() user: CurrentUserPayload,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<{ data: UserResponseDto }> {
    const result = await this.authenticationService.updateProfile(
      user.userId,
      updateUserDto,
    );
    return { data: result };
  }

  @Put('me/password')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async updatePassword(
    @CurrentUser() user: CurrentUserPayload,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<{ data: { message: string } }> {
    const result = await this.authenticationService.updatePassword(
      user.userId,
      updatePasswordDto,
    );
    return { data: result };
  }

  @Put('change-password')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @CurrentUser() user: CurrentUserPayload,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<{ data: { message: string } }> {
    const result = await this.authenticationService.changePassword(
      user.userId,
      changePasswordDto,
    );
    return { data: result };
  }

  @Get('sessions')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async getSessions(
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<{ data: SessionResponseDto[] }> {
    const sessions = await this.authenticationService.getUserSessions(
      user.userId,
    );
    return { data: sessions };
  }

  @Delete('sessions')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async logoutAllSessions(
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<{ data: { message: string } }> {
    const result = await this.authenticationService.logoutAllSessions(
      user.userId,
    );
    return { data: result };
  }

  @Delete('sessions/:sessionId')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async logoutSession(
    @CurrentUser() user: CurrentUserPayload,
    @Param('sessionId') sessionId: string,
  ): Promise<{ data: { message: string } }> {
    const result = await this.authenticationService.logoutSession(
      user.userId,
      sessionId,
    );
    return { data: result };
  }

  @Post('me/avatar')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async uploadAvatar(
    @CurrentUser() user: CurrentUserPayload,
    @Body() uploadAvatarDto: UploadAvatarDto,
  ): Promise<{ data: UserResponseDto }> {
    const result = await this.authenticationService.uploadAvatar(
      user.userId,
      uploadAvatarDto.imageUrl,
    );
    return { data: result };
  }
}

