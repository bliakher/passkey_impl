import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUser(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async getUserWithCredentials(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ) {
    return await this.prisma.user.findUnique({
      where: userWhereUniqueInput,
      include: { credentials: true },
    });
  }

  // async getUserWithCredentials(username: string) {
  //   return await this.prisma.user.findUnique({
  //     where: { username },
  //     include: { credentials: true },
  //   });
  // }

  async getUsers(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async updateUserById(
    userId: string,
    data: Prisma.UserUpdateInput,
  ): Promise<User | null> {
    return await this.prisma.user.update({ where: { id: userId }, data });
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    });
  }
}
