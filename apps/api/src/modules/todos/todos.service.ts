import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTodoDto } from './dtos/create.todo.dto';
import { UpdateTodoDto } from './dtos/update.todo.dto';
import { Todo } from './todos.entity';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private todosRepository: Repository<Todo>
  ) {}

  async create(createTodoDto: CreateTodoDto): Promise<Todo> {
    return this.todosRepository.save(createTodoDto);
  }

  async findAll(clientId: string): Promise<Todo[]> {
    return this.todosRepository.find({ where: { clientId } });
  }

  async findOne(id: number): Promise<Todo> {
    const data = await this.todosRepository.findOne({ where: { id } });
    if (!data) {
      throw new NotFoundException('todo not found');
    }
    return data;
  }

  async update(id: number, data: UpdateTodoDto): Promise<Todo> {
    const updatedData = await this.todosRepository.save({ id, ...data });
    return updatedData;
  }

  async remove(id: number): Promise<number> {
    const deletedData = await this.todosRepository.delete(id);
    return deletedData.affected;
  }

  async removeUserTodos(userId: string) {
    const deleted = await this.todosRepository.delete({ clientId: userId });
    return deleted.affected;
  }

  async markAllAsCompleted(clientId: string): Promise<void> {
    await this.todosRepository.update(
      { completed: false, clientId },
      { completed: true }
    );
  }
}
