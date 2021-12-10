import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { EntityNotFoundError } from 'src/errors/entity-not-found.error';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: number): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new EntityNotFoundError(`User with id #${id} was not found.`);
    }

    return user;
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async create(dto: CreateUserDto): Promise<User> {
    const data: Prisma.UserCreateInput = {
      ...dto,
    };

    return this.prisma.user.create({
      data,
    });
  }

  async update(id: number, dto: UpdateUserDto): Promise<User> {
    const data: Prisma.UserUpdateInput = {
      ...dto,
    };

    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async remove(id: number): Promise<User> {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
