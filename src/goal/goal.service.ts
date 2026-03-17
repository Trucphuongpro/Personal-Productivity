import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Goal } from './entities/goal.entity';
import { Repository } from 'typeorm';
import { Task } from 'src/tasks/entities/task.entity';
import { TasksStatus } from 'src/tasks/enums/task-status.enum';
//import { TasksService } from 'src/tasks/tasks.service';

@Injectable()
export class GoalService {
  constructor(
    @InjectRepository(Task)
    private goalRepository: Repository<Goal>,

    @InjectRepository(Goal)
    private taskRepository: Repository<Task>,
  ) {}

  async completeTask(taskID: string, goalID: string): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id: taskID },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // 1. update task
    task.status = TasksStatus.DONE;
    await this.taskRepository.save(task);

    // 2. đếm tổng task
    const total = await this.taskRepository.count({
      where: { goal: { id: goalID } },
    });

    // 3. đếm task DONE
    const done = await this.taskRepository.count({
      where: {
        goal: { id: goalID },
        status: TasksStatus.DONE,
      },
    });

    // 4. tính progress
    const progress = (done / total) * 100;

    // 5. update goal
    const goal = await this.goalRepository.findOne({
      where: { id: goalID },
    });

    if (!goal) {
      throw new NotFoundException('abc');
    }

    goal.progress = progress;
    await this.goalRepository.save(goal);

    return task;
  }
}
