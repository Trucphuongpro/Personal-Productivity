import {
  Body,
  Delete,
  Get,
  Logger,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Controller } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entity';
import { GetUser } from './getuser.interface';
import { RefreshTokenDTO } from './dto/refreshTokenDTO';
import { UserSignUpDto } from './dto/authCredentialDTO';
@Controller('user')
export class UserController {
  private logger = new Logger(UserController.name);
  constructor(private readonly userService: UserService) {}

  @Post('/signup')
  signUp(@Body() authCredential: UserSignUpDto): Promise<void> {
    return this.userService.signUp(authCredential);
  }

  @Post('/signIn')
  signIn(
    @Body() authCredential: UserSignUpDto,
  ): Promise<{ accessToken: string }> {
    return this.userService.signIn(authCredential);
  }
  @Post('/test')
  @UseGuards(AuthGuard('jwt'))
  test(@Req() req) {
    console.log('User đang truy cập', req.user);
  }

  @Delete('/:id')
  deleteUser(@Body() id: string) {
    return this.userService.deleteUser(id);
  }

  @Get('/test')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@GetUser() user: User) {
    return user;
  }

  @Post('/refresh')
  refreshAccessToken(@Body() refreshToken: RefreshTokenDTO) {
    console.log('BODY:', refreshToken);
    return this.userService.refreshAccessToken(refreshToken);
  }
}
