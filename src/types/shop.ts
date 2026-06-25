// Единые типы данных магазина. Используются и на клиенте, и на сервере,
// чтобы форма данных была одинаковой везде (товары, корзина, заказы).

export type ProductSpec = { label: string; value: string };

// Структурированное продающее описание для страницы товара.
export type ProductDetails = {
  summary: string; // краткое описание
  advantages: string[]; // преимущества
  usage: string[]; // где используется
  safety: string[]; // рекомендации по безопасности
};

export type Product = {
  id: string; // id документа Firestore
  name: string;
  description: string; // краткое описание (карточка / совместимость)
  price: number; // в тенге, целое число
  imageUrl: string; // главное фото
  images?: string[]; // галерея (первое = главное)
  alt?: string; // alt главного фото
  specs?: ProductSpec[]; // технические характеристики
  details?: ProductDetails; // структурированное описание
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
