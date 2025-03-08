import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { ClientsService } from './clients.service';
import { ClientDto } from './models/client.dto';

@ApiTags('clients')
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all clients' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  public async findAll() {
    try {
      return this.clientsService.findAll();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a client by ID' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  public async findOne(@Param('id', ParseUUIDPipe) id: string) {
    try {
      const client = await this.clientsService.findOne(id);
      if (!client) {
        throw new NotFoundException(`Client not found`);
      }
      return client;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else if (error instanceof HttpException) {
        throw error;
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  @Post()
  @ApiOperation({ summary: 'Create a new client' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Client created',
    type: ClientDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid client data' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  public async create(@Body() clientDto: ClientDto) {
    try {
      return await this.clientsService.create(clientDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a client by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Client updated',
    type: ClientDto,
  })
  @ApiParam({ name: 'id', type: 'string', description: 'Client ID (UUID)' })
  @ApiNotFoundResponse({ description: 'Client not found' })
  @ApiBadRequestResponse({ description: 'Invalid client data or UUID format' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  public async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() clientDto: ClientDto
  ) {
    try {
      const updatedClient = await this.clientsService.update(id, clientDto);
      if (!updatedClient) {
        throw new NotFoundException(`Client not found`);
      }
      return updatedClient;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else if (error instanceof HttpException) {
        throw error;
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a client by ID' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Client deleted' })
  @ApiNotFoundResponse({ description: 'Client not found' })
  @ApiBadRequestResponse({ description: 'Invalid UUID format' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param('id', ParseUUIDPipe) id: string) {
    try {
      return this.clientsService.delete(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else if (error instanceof HttpException) {
        throw error;
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }
}
