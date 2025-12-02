import { Module } from '@nestjs/common';
import { UsersResolver } from './users.resolver';
import { UsersService } from './service/user.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [UsersResolver, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
