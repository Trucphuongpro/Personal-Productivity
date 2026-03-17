import { Module } from '@nestjs/common';
import { GoalService } from './goal.service';
import { GoalController } from './goal.controller';
//import { ConfigModule } from '@nestjs/config';
import { Goal } from './entities/goal.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from 'src/tasks/entities/task.entity';
import { TasksModule } from 'src/tasks/tasks.module';
//import { TasksModule } from 'src/tasks/tasks.module';

@Module({
  imports: [TypeOrmModule.forFeature([Goal, Task]), TasksModule],
  controllers: [GoalController],
  providers: [GoalService],
})
export class GoalModule {}
