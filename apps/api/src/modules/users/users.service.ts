import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { TodosService } from '../todos/todos.service';
import { UserDto } from './models/user-dto.model';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly todosService: TodosService
  ) {}

  public async findAll() {
    return this.userRepository.find();
  }

  /**
   * Find result in database with specific id and return.
   * Otherwise, return NotFoundException (404)
   * @param userId
   */
  public async findOne(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      return new NotFoundException('User not found');
    }
    return user;
  }

  /**
   * Create new User
   * Returns created User
   * @param userDto
   */
  public async create(userDto: UserDto) {
    const createdClient = await this.userRepository.save(userDto);
    return createdClient;
  }

  /**
   * Update user data
   * @param id
   * @param user
   */
  public async update(id: string, user: UserDto) {
    const updatedData = await this.userRepository.save({ id, ...user });
    return updatedData;
  }

  /**
   * Delete User record
   * @param userId
   */
  public async delete(userId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const userRef = await this.userRepository.findOne({
        where: { id: userId },
      });

      if (!userRef) {
        throw new NotFoundException('User not found');
      }

      await this.todosService.removeUserTodos(userId); // first todos
      await this.userRepository.delete(userId); /// ...then user

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error; // Re-throw the error
    } finally {
      await queryRunner.release();
    }
  }
}
