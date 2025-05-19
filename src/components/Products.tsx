'use client';

import { Button } from '@/components/ui/button';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
};

type CartItem = {
  product_id: number;
  quantity: number;
};

type Notification = {
  id: string; // Теперь ID - строка
  message: string;
  type: 'success' | 'error' | 'warning';
};

export default function Products({ products }: { products: Product[] }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Функция для добавления уведомления
  const addNotification = (message: string, type: 'success' | 'error' | 'warning') => {
    const newNotification = {
      id: crypto.randomUUID(), // Генерация уникального ID
      message,
      type,
    };
    setNotifications(prev => [...prev, newNotification]);

    // Автоматическое удаление уведомления через 3 секунды
    setTimeout(() => {
      setNotifications(prev =>
        prev.filter(notification => notification.id !== newNotification.id),
      );
    }, 3000);
  };

  const handleAddToCart = async (productId: number) => {
    try {
      const res = await fetch('http://localhost:3001/cart', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId, quantity: 1 }),
      });

      if (res.status === 401) {
        addNotification('Требуется авторизация', 'warning');
        return;
      }

      if (!res.ok) {
        throw new Error('Не удалось загрузить данные пользователя');
      }
      const data: { item: CartItem } = await res.json();

      addNotification(`Добавлено в корзину (Всего: ${data.item.quantity} шт.)`, 'success');
    } catch (error) {
      let errorMessage = 'Ошибка добавления';

      if (error instanceof Error) {
        errorMessage += `: ${error.message}`;
      }

      addNotification(errorMessage, 'error');
    }
  };

  return (
    <div className="relative">
      {/* Список уведомлений */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map(notification => (
          <div
            key={notification.id} // Уникальный ключ
            className={`p-3 rounded-lg shadow-md text-sm transition-all duration-400 ${
              notification.type === 'success'
                ? 'bg-green-100 text-green-700 border border-green-200'
                : notification.type === 'error'
                  ? 'bg-red-100 text-red-700 border border-red-200'
                  : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <span>{notification.message}</span>
              <button
                onClick={() =>
                  setNotifications(prev =>
                    prev.filter(n => n.id !== notification.id),
                  )}
                className="text-lg leading-none hover:opacity-70"
              >
                &times;
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Список товаров */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {products.map(product => (
          <article
            key={product.id}
            className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow flex flex-col h-full"
          >
            <div className="mb-4">
              <Image
                src={product.image_url}
                alt={product.name}
                width={400}
                height={200}
                className="w-full h-48 object-cover rounded-md"
              />
            </div>

            <div className="flex flex-col flex-grow">
              <h2 className="text-xl font-semibold mb-2 line-clamp-2 h-14 overflow-hidden">
                {product.name}
              </h2>

              <p className="text-gray-600 line-clamp-3 mb-4 flex-grow">
                {product.description}
              </p>

              <div className="flex justify-between items-center mt-auto">
                {/* Цена - увеличенный размер и отступы */}
                <p className="text-gray-900 font-bold text-xl mr-4">
                  {Number(product.price).toLocaleString('ru-RU', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                  {' '}
                  ₸
                </p>

                {/* Группа кнопок с гармоничными размерами */}
                <div className="flex gap-3">
                  <Link href={`/products/${product.id}`}>
                    <Button
                      variant="outline"
                      className="h-10 px-4 py-2 text-base"
                    >
                      Перейти
                    </Button>
                  </Link>
                  <Button
                    type="button"
                    onClick={() => handleAddToCart(product.id)}
                    className="h-10 w-10 p-0 flex items-center justify-center"
                    variant="default"
                  >
                    <ShoppingCartIcon className="h-5 w-5 text-white" />
                  </Button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
