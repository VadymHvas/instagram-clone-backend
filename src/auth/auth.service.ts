import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Request, Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { returnUserFields } from '../utils/return.user.fields';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private configService: ConfigService,
        private jwtService: JwtService,
    ) {}

    public async register(res: Response, dto: RegisterDto) {
        const oldUser = await this.userModel.findOne({username: dto.username});

        if (oldUser) {
            throw new ConflictException("Username is already in use");
        }

        const hashPassword = await argon2.hash(dto.password);

        const doc = new this.userModel({
            name: dto.name, username: dto.username, password: hashPassword
        });

        await doc.save();

        const tokens = this.generateTokens(doc.id);

        this.setRefreshInCookies(res, tokens.refresh);

        return { access: tokens.access, user: returnUserFields(doc) };
    }

    public async login(res: Response, dto: LoginDto) {
        const user = await this.userModel.findOne({username: dto.username});

        if (!user) {
            throw new NotFoundException("Incorrect password or username");
        }

        const isCorrectPassword = await argon2.verify(user.password, dto.password);

        if (!isCorrectPassword) {
            throw new NotFoundException("Incorrect password or username");
        }

        const tokens = this.generateTokens(user.id);

        this.setRefreshInCookies(res, tokens.refresh);

        return { access: tokens.access, user: returnUserFields(user) };
    }

    public async refresh(req: Request, res: Response) {
        const refresh = req.cookies["refresh"];

        if (!refresh) {
            throw new UnauthorizedException();
        }

        try {
            const payload = await this.jwtService.verifyAsync(refresh, {
                secret: this.configService.get("JWT_SECRET")
            });

            const tokens = this.generateTokens(payload.id);

            this.setRefreshInCookies(res, tokens.refresh);

            return { access: tokens.access }
        } catch (error) {
            throw new BadRequestException();
        }
    }

    private generateTokens(id: string) {
        const refresh = this.jwtService.sign({id}, {
            expiresIn: "30d",
            secret: this.configService.get("JWT_SECRET")
        });

        const access = this.jwtService.sign({id}, {
            expiresIn: "1h",
            secret: this.configService.get("JWT_SECRET")
        });

        return { refresh, access };
    }

    private setRefreshInCookies(res: Response, token: string) {
        res.cookie("refresh", token, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 30 * 24 * 60 * 60 * 1000
        });
    }
}