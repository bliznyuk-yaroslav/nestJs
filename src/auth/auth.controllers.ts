import { Body, Controller, Post, UseGuards, Req, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}
  @Post('register')
  register(@Body() body: { email: string; password: string, name:string }) {
    return this.auth.register(body.email,body.password,body.name,);
  }
  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    return this.auth.login(body.email, body.password);
  }
  @Post('refresh')
  refresh(@Body() body: { refreshToken: string }) {
    return this.auth.refresh(body.refreshToken);
  }
  @UseGuards(AuthGuard)
  @Post('logout')
  logout(@Req() req: any) {
    return this.auth.logout(req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  me(@Req() req: any) {
    return this.auth.me(req.user.sub);
  }
}
