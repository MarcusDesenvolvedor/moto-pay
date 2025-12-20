"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const config_1 = require("@nestjs/config");
const authentication_controller_1 = require("./controllers/authentication.controller");
const authentication_service_1 = require("./application/authentication.service");
const user_repository_1 = require("./infrastructure/repositories/user.repository");
const refresh_token_repository_1 = require("./infrastructure/repositories/refresh-token.repository");
const jwt_strategy_1 = require("./strategies/jwt.strategy");
const prisma_service_1 = require("../../../../../shared/infrastructure/prisma/prisma.service");
let AuthenticationModule = class AuthenticationModule {
};
exports.AuthenticationModule = AuthenticationModule;
exports.AuthenticationModule = AuthenticationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            passport_1.PassportModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => {
                    const secret = configService.get('JWT_SECRET');
                    if (!secret) {
                        throw new Error('JWT_SECRET is not defined in environment variables');
                    }
                    return {
                        secret,
                        signOptions: {
                            expiresIn: configService.get('JWT_ACCESS_EXPIRES_IN', '15m') || '15m',
                        },
                    };
                },
                inject: [config_1.ConfigService],
            }),
        ],
        controllers: [authentication_controller_1.AuthenticationController],
        providers: [
            authentication_service_1.AuthenticationService,
            user_repository_1.UserRepository,
            refresh_token_repository_1.RefreshTokenRepository,
            jwt_strategy_1.JwtStrategy,
            prisma_service_1.PrismaService,
            {
                provide: 'IUserRepository',
                useClass: user_repository_1.UserRepository,
            },
            {
                provide: 'IRefreshTokenRepository',
                useClass: refresh_token_repository_1.RefreshTokenRepository,
            },
        ],
        exports: [authentication_service_1.AuthenticationService, jwt_strategy_1.JwtStrategy],
    })
], AuthenticationModule);
//# sourceMappingURL=authentication.module.js.map