import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class RegisterDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(40)
    @MinLength(3)
    @Matches(/^[a-z][a-z0-9.]*[^0-9.]$/i, { message: "Enter correct username" })
    public username: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(100)    
    public name: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8, { message: "Password is too short" })
    public password: string;
}