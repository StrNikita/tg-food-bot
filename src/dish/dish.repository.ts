import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DishEntity } from 'src/dish/dish.entity';
import { DishType } from 'src/dish/enum/dish-type.enum';
import { Repository } from 'typeorm';

@Injectable()
export class DishRepository {
  constructor(
    @InjectRepository(DishEntity)
    private readonly dishEntity: Repository<DishEntity>,
  ) {}

  public async find(): Promise<DishEntity[]> {
    return this.dishEntity.find();
  }

  public async findAllByType(dishType: DishType): Promise<DishEntity[]> {
    return this.dishEntity.find({
      where: { dish_type: dishType },
    });
  }

  public async findOneByUuid(uuid: string): Promise<DishEntity | null> {
    const dish = await this.dishEntity.findOne({
      where: { uuid },
    });

    return dish;
  }
}
