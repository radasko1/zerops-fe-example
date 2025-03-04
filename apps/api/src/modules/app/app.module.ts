import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule } from '../clients/clients.module';
import { TodosModule } from '../todos/todos.module';

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
    ClientsModule,
  ],
})
export class AppModule {}
