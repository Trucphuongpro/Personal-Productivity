import { Controller } from '@nestjs/common';
import { GoalService } from './goal.service';
import { Patch } from '@nestjs/common';
@Controller('goal')
export class GoalController {
  constructor(private readonly goalService: GoalService) {}
  @Patch()
  completeTask(goalID: string, taskID: string) {
    return this.goalService.completeTask(goalID, taskID);
  }
}
