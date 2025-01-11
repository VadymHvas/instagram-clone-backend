import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { returnUserFields } from '../utils/return.user.fields';

@Injectable()
export class UserService {
  public constructor(@InjectModel(User.name) private userModel: Model<User>) {};

  public async getMe(req: Request) {
    const token = req["user"];
    const user = await this.userModel.findById(token.id);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return returnUserFields(user);
  };
}
