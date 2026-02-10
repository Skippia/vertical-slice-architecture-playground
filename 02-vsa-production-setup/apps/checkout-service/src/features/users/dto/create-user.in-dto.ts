import { IsEmail, IsString, MinLength } from 'class-validator'

export class CreateUserInDto {
  @IsEmail()
  email: string

  @IsString()
  @MinLength(1)
  name: string
}
