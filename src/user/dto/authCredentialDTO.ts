import { IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { USERNAME_REGEX } from 'src/constants/regex';

export class UserSignUpDto {
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @Matches(USERNAME_REGEX, {
    message: 'Username chỉ được chứa chữ, số, dấu _, từ 4-20 ký tự',
  })
  username: string;

  @IsString()
  @MinLength(6)
  password: string;
}
