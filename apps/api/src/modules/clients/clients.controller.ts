import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ClientsService } from './clients.service';
import { ClientDto } from './models/client.dto';

@ApiTags('clients')
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  public findAll() {
    return this.clientsService.findAll();
  }

  @Get(':id')
  public findOne(@Param('id') id: string) {
    return this.clientsService.findOne(id);
  }

  @Post()
  public create(@Body() clientDto: ClientDto) {
    return this.clientsService.create(clientDto);
  }

  @Put(':id')
  public update(@Param('id') id: string, @Body() clientDto: ClientDto) {
    return this.clientsService.update(id, clientDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public delete(@Param('id') id: string) {
    return this.clientsService.delete(id);
  }
}
