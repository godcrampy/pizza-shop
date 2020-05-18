interface Food {
  food_id: number;
  price: number;
  name: string;
}

interface Pizza {
  food_id: number;
  size: number;
}

interface Drink {
  food_id: number;
  quantity: number;
}

interface DrinkFood extends Drink, Food {}

interface PizzaFood extends Pizza, Food {}

interface FoodQuantity {
  food_id: number;
  quantity: number;
}

interface Contains extends FoodQuantity {
  id: number;
}

interface Order {
  id: number;
  phone: number;
}
