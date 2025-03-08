import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateTodoDto } from './dtos/create.todo.dto';
import { UpdateTodoDto } from './dtos/update.todo.dto';
import { TodosService } from './todos.service';

@ApiTags('todos')
@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new todo' })
  @ApiResponse({
    status: 201,
    description: 'The todo has been successfully created.',
  })
  create(@Body() createTodoDto: CreateTodoDto) {
    return this.todosService.create(createTodoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all todos' })
  @ApiResponse({ status: 200, description: 'List of todos.' })
  findAll(@Query('clientId') clientId: string) {
    return this.todosService.findAll(clientId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a todo by id' })
  @ApiResponse({ status: 200, description: 'The todo with the matching id.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.todosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a todo by id' })
  @ApiResponse({ status: 200, description: 'The updated todo.' })
  update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateTodoDto) {
    return this.todosService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a todo by id' })
  @ApiResponse({ status: 200, description: 'The number of deleted todos.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.todosService.remove(id);
  }

  @Patch('mark-all-as-completed')
  @ApiOperation({ summary: 'Mark all todos as completed' })
  @ApiResponse({ status: 200, description: 'The number of updated todos.' })
  markAllAsCompleted(@Query('clientId') clientId: string) {
    return this.todosService.markAllAsCompleted(clientId);
  }
}
