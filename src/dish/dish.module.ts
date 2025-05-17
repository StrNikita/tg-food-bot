import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DishEntity } from 'src/dish/dish.entity';
import { DishRepository } from 'src/dish/dish.repository';
import { DishService } from 'src/dish/dish.service';

@Module({
  imports: [TypeOrmModule.forFeature([DishEntity])],
  providers: [DishService, DishRepository],
  exports: [DishService],
})
export class DishModule {}
