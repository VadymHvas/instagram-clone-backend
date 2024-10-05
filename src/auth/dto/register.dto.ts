import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class RegisterDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(30)        
    public username: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(100)    
    public name: string;

    @IsNotEmpty()
    @IsString()
    public password: string;
}