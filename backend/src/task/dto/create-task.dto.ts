import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  Title: string;

  @IsString()
  @IsNotEmpty()
  Description: string;
}