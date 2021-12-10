import { Injectable } from '@nestjs/common';
import { Post, Prisma } from '@prisma/client';
import { EntityNotFoundError } from 'src/errors/entity-not-found.error';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: number): Promise<Post | null> {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
      },
    });

    if (!post) {
      throw new EntityNotFoundError(`Post with id #${id} was not found.`);
    }

    return post;
  }

  async findAll(): Promise<Post[]> {
    return this.prisma.post.findMany({
      include: {
        author: true,
      },
    });
  }

  async getPublishedPosts(): Promise<Post[]> {
    return this.prisma.post.findMany({
      where: { published: true },
    });
  }

  async create(dto: CreatePostDto): Promise<Post> {
    const { authorEmail } = dto;

    delete dto.authorEmail;

    const data: Prisma.PostCreateInput = {
      ...dto,
      author: {
        connect: {
          email: authorEmail,
        },
      },
    };

    return this.prisma.post.create({
      data,
      include: {
        author: true,
      },
    });
  }

  async update(id: number, dto: UpdatePostDto): Promise<Post> {
    const data: Prisma.PostUpdateInput = {
      ...dto,
    };

    return this.prisma.post.update({
      where: { id },
      data,
    });
  }

  async remove(id: number): Promise<Post> {
    return this.prisma.post.delete({
      where: { id },
    });
  }
}
