import { IsEmail, IsString, MaxLength } from 'class-validator';

export class UserDto {
  @IsString()
  @MaxLength(50)
  name: string;

  @IsEmail()
  email: string;
}
