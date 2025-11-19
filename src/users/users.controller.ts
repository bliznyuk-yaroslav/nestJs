import {
  Controller,
  Post,
  UseGuards,
  Get,
  Delete,
  Patch,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { UsersService } from './users.service';
@UseGuards(AuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin/users')
export class UserControllers {
  constructor(private users: UsersService) {}
  @Get()
  list() {
    return this.users.listUsers();
  }
  @Post()
  create(
    @Body()
    body: {
      email: string;
      password: string;
      name: string;
      role?: 'USER' | 'ADMIN' | 'ORGANIZER';
    },
  ) {
    return this.users.createUser(body);
  }
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    body: {
      email?: string;
      password?: string;
      name?: string;
      role?: 'USER' | 'ADMIN' | 'ORGANIZER';
    },
  ) {
    return this.users.update(id, body);
  }
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.users.remove(id);
  }
}
