import { Prisma } from '@prisma/client';

export class Post implements Prisma.PostUncheckedCreateInput {
  id?: number;
  title: string;
  content?: string | null;
  published?: boolean | null;
  authorId?: number | null;
}
