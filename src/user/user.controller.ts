import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../guards/auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("/me")
  @UseGuards(AuthGuard)
  public async getMe(@Req() req: Request) {
    return await this.userService.getMe(req);
  };
}
