// Единые типы данных магазина. Используются и на клиенте, и на сервере,
// чтобы форма данных была одинаковой везде (товары, корзина, заказы).

export type Product = {
  id: string; // id документа Firestore
  name: string;
  description: string;
  price: number; // в тенге, целое число
  imageUrl: string;
};

// Позиция в корзине = товар + количество.
export type CartItem = Product & {
  quantity: number;
};

export type OrderStatus = 'pending' | 'paid' | 'cancelled';

export type Order = {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  createdAt: number; // Unix-время в мс
};
