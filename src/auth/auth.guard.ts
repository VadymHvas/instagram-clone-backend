import { BadRequestException, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService
    ) {}

    public async canActivate(ctx: ExecutionContext): Promise<boolean> {
        const request = ctx.switchToHttp().getRequest();
        const token = this.extractTokenFromHeaders(request);

        if (!token) {
            throw new UnauthorizedException();
        } 

        try {
            const payload = this.jwtService.verifyAsync(token, {
                secret: this.configService.get("JWT_SECRET")
            });

            request["user"] = payload;
        } catch (error) {
            throw new BadRequestException();
        }

        return true;
    }

    private extractTokenFromHeaders(request: Request): string {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}