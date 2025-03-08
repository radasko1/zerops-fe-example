import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { TodosService } from '../todos/todos.service';
import { Client } from './clients.entity';
import { ClientDto } from './models/client.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientsRepository: Repository<Client>,
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly todosService: TodosService
  ) {}

  public async findAll() {
    return this.clientsRepository.find();
  }

  /**
   * Find result in database with specific id and return.
   * Otherwise, return NotFoundException (404)
   * @param clientId
   */
  public async findOne(clientId: string) {
    const clientRef = await this.clientsRepository.findOne({
      where: { id: clientId },
    });
    if (!clientRef) {
      return new NotFoundException('Client not found');
    }
    return clientRef;
  }

  /**
   * Create new client
   * Returns created client
   * @param client
   */
  public async create(client: ClientDto) {
    const createdClient = await this.clientsRepository.save(client);
    return createdClient;
  }

  /**
   * Update user data
   * @param id
   * @param user
   */
  public async update(id: string, user: ClientDto) {
    const updatedData = await this.clientsRepository.save({ id, ...user });
    return updatedData;
  }

  /**
   * Delete client record
   * @param clientId
   */
  public async delete(clientId: string) {
    // Start transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const userRef = await this.clientsRepository.findOne({
        where: { id: clientId },
      });
      if (!userRef) {
        throw new NotFoundException('User not found');
      }

      const deletedUser = await this.clientsRepository.delete(clientId);
      const deletedTodos = await this.todosService.removeUserTodos(clientId);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
