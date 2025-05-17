import { Injectable } from '@nestjs/common';
import { DishEntity } from 'src/dish/dish.entity';
import { DishRepository } from 'src/dish/dish.repository';
import { DishType } from 'src/dish/enum/dish-type.enum';

@Injectable()
export class DishService {
  constructor(private readonly dishRepository: DishRepository) {}

  public async find(): Promise<DishEntity[]> {
    return this.dishRepository.find();
  }

  public async findAllByType(dishType: DishType): Promise<DishEntity[]> {
    return this.dishRepository.findAllByType(dishType);
  }

  public async findOneByUuid(uuid: string): Promise<DishEntity | null> {
    return this.dishRepository.findOneByUuid(uuid);
  }
}
