import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodosModule } from '../todos/todos.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DB_URL,
      ssl: false,
      autoLoadEntities: true,
      synchronize: true,
    }),
    TodosModule,
    UsersModule,
  ],
})
export class AppModule {}
