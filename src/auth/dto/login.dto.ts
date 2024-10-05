import { IsNotEmpty } from "class-validator";

export class LoginDto {
    @IsNotEmpty()
    public username: string;

    @IsNotEmpty()
    public password: string;
}