import { Trim } from 'class-sanitizer';
import { IsEmail, IsString, Length, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @MinLength(4, { message: 'Username should be minimum of 4 characters' })
  @Trim()
  public username: string;

  @IsString()
  @MinLength(8, { message: 'Password should be minimum of 8 characters' })
  @Trim()
  public password?: string;
}

export class RegisterDto {

  @Length(4, 20)
  username: string;

  @Length(8, 20)
  password: string;

  @Length(3, 20)
  firstName: string;

  middleName: string;

  lastName: string;

  @Length(8, 11)
  phone: string;

  @IsEmail()
  email: string;
}

export class RefreshTokenDto {
  @IsString()
  @Trim()
  public refreshToken: string;
}
