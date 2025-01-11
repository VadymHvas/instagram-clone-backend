import { BadRequestException, CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import {ConfigService} from "@nestjs/config";
import {JwtService} from "@nestjs/jwt";
import {Request} from "express";

@Injectable()
export class AuthGuard implements CanActivate {
    public constructor(
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
            request["user"] = await this.jwtService.verify(token, {
                secret: this.configService.get("JWT_SECRET")
            });
        } catch (err) {
            throw new BadRequestException();
        }

        return true;
    }

    private extractTokenFromHeaders(request: Request): string {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}