import { DishEntity } from 'src/dish/dish.entity';

export const greetingsMessage = () => `👨‍🍳 Приветствую в ресторане Никиты!
Я — шеф Никита, и сегодня я работаю только для тебя.

Здесь нет меню на стене — всё готовлю по настроению:
от уютного чаёчка с печеньем до пасты с креветками под музыку дождя 🌧🍤

Садись поудобнее...
А я пока загляну на кухню — что бы такого вкусненького для тебя придумать? 😌`;

export const mainMenuMessage = () => `📖 Меню специально для тебя:
Выбирай, что тебе по вкусу сегодня — я всё приготовлю с душой 🤍`;

export const drinksMenuMessage = () => `Здесь — всё, чтобы расслабиться: от ароматного чая до чего-нибудь послаще.
Что тебе налить сегодня?`;

export const orderMessage = (dishes: DishEntity[]) => `Вот что ты выбрала на сегодня:
${dishes.map(dish => `🍽 ${dish.name}`).join('\n')}

Я уже на кухне — жду подтверждения заказа 👨‍🍳`;

export const chefOrderMessage = (dishes: DishEntity[]) => `Пришел новый заказ!:
${dishes.map(dish => `🍽 ${dish.name}`).join('\n')}`;

export const dishDetailMessage = (dish: DishEntity) => `Итак, ${dish.name}, отличный выбор!
${dish.description}

Добавляем в заказ?`;

export const dishAddedToOrderMessage = () => `🧾 Добавил в заказ!
Хороший выбор — это блюдо я особенно люблю готовить 😌
Если захочешь ещё что-то — просто скажи.`;

export const approvedOrderMessage = () => `✅ Заказ принят!
Я всё записал и уже на кухне 👨‍🍳

Натянул фартук, разогреваю сковородку — будет вкусно, обещаю.
Ожидай, моя звезда, скоро всё будет готово ✨`;

export const chefAcceptOrderMessage = () => `✅ Заказ принят!`;
export const chefCompleteOrderMessage = () => `✅ Заказ готов! Доставьте ваш заказ!`;
export const chefDoneOrderMessage = () => `✅ Заказ выполнен успешно, ожидайте оценку`;
export const chefOrderRatedMessage = (rate: string) => `✅ Заказ оценен на ${rate}`;

export const chefAcceptedOrderMessage = () => `👨‍🍳 Заказ принят! Ожидайте сообщение о готовности!`;
export const chefCompletedOrderMessage = () => `👨‍🍳 Заказ готов! Ожидайте доставку!`;
export const chefOrderDoneMessage = () => `👨‍🍳 Заказ Выполнен! Оцените заказ!`;
export const orderRatedMessage = () => `👨‍🍳 Заказ успешно оценен, спасибо за оценку и отдельное спасибо за заказ!
Надеюсь, вам всё понравилось!
Ждем новых заказов!`;
