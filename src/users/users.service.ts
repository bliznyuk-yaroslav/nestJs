import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async listUsers() {
    const rows = await this.prisma.user.findMany({
      orderBy: { id: 'asc' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });
    const items = rows.map((item) => ({
      id: item.id,
      email: item.email,
      name: item.name,
      role: item.role,
      createdAt: item.createdAt,
    }));
    return { items };
  }
  async createUser(data: {
    email: string;
    password: string;
    name: string;
    role?: 'USER' | 'ADMIN' | 'ORGANIZER';
  }) {
    const exists = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (exists) throw new ConflictException('Email already exists');
    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        name: data.name,
        role: (data.role ?? 'USER') as any,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });
    return { user };
  }
  async update(
    id: number,
    data: {
      email?: string;
      password?: string;
      name?: string;
      role?: 'USER' | 'ADMIN' | 'ORGANIZER';
    },
  ) {
    const existing = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!existing) throw new ConflictException('User not found');
    let passwordHash: string | undefined = undefined;
    if (data.password) passwordHash = await bcrypt.hash(data.password, 10);
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        email: data.email,
        name: data.name,
        role: (data.role as any) ?? undefined,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });
    return { user };
  }
  async remove(id: number) {
    const existing = await this.prisma.user.findUnique({ where: { id } });

    if (!existing) throw new ConflictException('User not found');
    await this.prisma.user.delete({ where: { id } });
    return { ok: true };
  }
}
