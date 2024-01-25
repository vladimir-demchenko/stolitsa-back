import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegistrationDto } from './dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenRequestDto } from './dto';
import { ForgotPasswordDto } from 'src/auth/dto/forgot-password.dto';
import { RestorePasswordDto } from 'src/auth/dto/restore-password.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('/registration')
  registration(@Body() userDto: RegistrationDto) {
    return this.authService.registration(userDto);
  }

  @Post('/login')
  login(@Body() userDto: LoginDto) {
    return this.authService.login(userDto);
  }

  @Post('/refresh-token')
  refreshToken(@Body() refreshTokenRequestDto: RefreshTokenRequestDto) {
    return this.authService.refreshToken(refreshTokenRequestDto);
  }

  @Post('/forgotPassword')
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }
  @Post('/restorePassword/:token')
  restorePassword(
    @Param('token') token: string,
    @Body() restorePasswordDto: RestorePasswordDto,
  ) {
    return this.authService.restorePassword(token, restorePasswordDto);
  }
  @Get('/pub-key')
  getPublicKey() {
    return this.authService.getPublicKey();
  }
}
