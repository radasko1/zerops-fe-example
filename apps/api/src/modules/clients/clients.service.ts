import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './clients.entity';
import { ClientDto } from './models/client.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientsRepository: Repository<Client>
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
}
