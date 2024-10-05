import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get("JWR_SECRET")
      })
    }),

    MongooseModule.forFeature([
      {name: User.name, schema: UserSchema}
    ]),

    ConfigModule
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
