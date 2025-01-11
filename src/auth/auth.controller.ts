import { Body, Controller, Get, Post, Req, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { Request, Response } from 'express';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {};

  @Post("register")
  @UsePipes(new ValidationPipe({ transform: true }))
  public async register(@Res({ passthrough: true }) res: Response, @Body() dto: RegisterDto) {
    return await this.authService.register(res, dto);
  }

  @Post("login")
  @UsePipes(new ValidationPipe({ transform: true }))
  public async login(@Res({ passthrough: true }) res: Response, @Body() dto: LoginDto) {
    return await this.authService.login(res, dto);
  }

  @Get("refresh")
  public async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return await this.authService.refresh(req, res);
  }
}
