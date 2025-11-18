import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import {User } from '@prisma/client';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getUser(): Promise<User[]> {
    return this.appService.getUser();
  }
  @Post()
  async createUser(
    @Body() data:{name:string, email:string, age?:number},): Promise<User> {return this.appService.createUser(data)}
  
}
