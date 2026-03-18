import { Controller, Post } from '@nestjs/common';
import { GoalService } from './goal.service';
import { Patch } from '@nestjs/common';
import { CreateGoalDto } from './dto/create-goal.dto';
import { Body } from '@nestjs/common';

@Controller('goal')
export class GoalController {
  constructor(private readonly goalService: GoalService) {}

  @Post()
  createGoal(@Body() createGoalDto: CreateGoalDto) {
    console.log(createGoalDto);
    return this.goalService.createGoal(createGoalDto);
  }
  @Patch()
  completeTask(goalID: string, taskID: string) {
    return this.goalService.completeTask(goalID, taskID);
  }
}
