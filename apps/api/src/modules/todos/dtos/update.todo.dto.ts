import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateTodoDto {
  @ApiProperty({
    description: 'The updated text of the todo item',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly text: string;

  @ApiProperty({
    description: 'The updated completion status of the todo item',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  readonly completed: boolean;
}
