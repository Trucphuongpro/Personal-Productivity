import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { UserSignUpDto } from './dto/authCredentialDTO';
import { User } from './entities/user.entity';
import { RefreshTokenDTO } from './dto/refreshTokenDTO';
import { TOKEN_EXPIRED_DAYS } from 'src/constants/common';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredential: UserSignUpDto): Promise<void> {
    const { username, password } = authCredential;

    // Check username exists table users
    const existingUser = await this.userRepository.findOneBy({ username });
    if (existingUser) {
      throw new BadRequestException(
        'Cannot signup with this credentials. Please try another information!',
      );
    }
    // Move gen password hash => service
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = this.userRepository.create({
      username,
      password: hashedPassword,
    });

    await this.userRepository.save(user);

    // try {
    //   await this.userRepository.save(user);
    // } catch (error) {
    //   console.log('Error', error);
    //   throw new InternalServerErrorException();
    // }
  }

  async signIn(authCredential: UserSignUpDto) {
    const { username, password } = authCredential;

    const user = await this.userRepository.findOneBy({ username });
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { username };
      const accessToken = this.jwtService.sign(payload);
      const refreshToken = this.jwtService.sign(payload, {
        expiresIn: TOKEN_EXPIRED_DAYS,
      });
      // lưu refreshToken vào DB
      user.refreshToken = refreshToken;
      await this.userRepository.save(user);

      return {
        accessToken,
        refreshToken,
      };
    }
    throw new UnauthorizedException('Login is failed');
  }

  async refreshAccessToken(
    refreshTokenDTO: RefreshTokenDTO,
  ): Promise<{ accessToken: string }> {
    const { refreshToken } = refreshTokenDTO;

    const payload = this.jwtService.verify(refreshToken);

    const user = await this.userRepository.findOne({
      where: { username: payload.username },
    });

    if (!user || user.refreshToken !== refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const accessToken = this.jwtService.sign({
      username: user.username,
    });

    return { accessToken };
  }

  async deleteUser(id: string): Promise<void> {
    const result = await this.userRepository.delete({ id });

    if (!result) {
      throw new NotFoundException('User with id not found');
    }
  }
}
