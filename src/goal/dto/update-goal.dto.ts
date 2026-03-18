import { PartialType } from '@nestjs/mapped-types';
import { CreateGoalDto } from './create-goal.dto';
//import { Goal } from '../entities/goal.entity';

export class UpdateGoalDto extends PartialType(CreateGoalDto) {
  targetDate: string;
  progress: string;
}
