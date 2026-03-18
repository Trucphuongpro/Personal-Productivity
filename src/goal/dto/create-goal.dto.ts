import { IsNotEmpty, IsDateString } from 'class-validator';
export class CreateGoalDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsDateString()
  targetDate: string;
}
