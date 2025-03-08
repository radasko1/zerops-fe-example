import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export class CreateTodoDto {
  @ApiProperty({ description: 'clientId - use your initials' })
  @IsString()
  readonly clientId: string;

  @ApiProperty({ description: 'The text of the todo item' })
  @IsString()
  readonly text: string;

  @ApiProperty({
    description: 'The completion status of the todo item',
    default: false,
  })
  @IsBoolean()
  readonly completed: boolean;

  @ApiProperty({ description: 'Owner of the Todo item' })
  @IsString()
  readonly userId: string;
}
