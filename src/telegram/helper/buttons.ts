import { DishEntity } from 'src/dish/dish.entity';

export const DishButtons = (dishes: DishEntity[]) => {
  const maxButtonsInRow = 2;
  const buttonsInRow = Math.min(dishes.length, maxButtonsInRow);
  const buttonsCount = Math.ceil(dishes.length / buttonsInRow);
  const buttons = Array.from({ length: buttonsCount }, (_, i) => {
    return dishes.slice(i * buttonsInRow, i * buttonsInRow + buttonsInRow);
  });

  return buttons.map(dishes =>
    dishes.map(dish => {
      return {
        text: dish.name,
        callback_data: `dish:${dish.uuid}`,
      };
    }),
  );
};
