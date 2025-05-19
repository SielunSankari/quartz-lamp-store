// app/users/profile/page.tsx
'use client';

import { Button } from '@/components/ui/button';
import { useCartStore } from '@/stores/useCartStore';
import { useUserStore } from '@/stores/useUserStore';
import { TrashIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

export default function UserProfilePage() {
  const t = useTranslations('Profile');
  const { user, setUser } = useUserStore();
  const { cart, totalItems, totalPrice, removeItem } = useCartStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Загрузка данных пользователя
        const userResponse = await axios.get('http://localhost:3001/getUser', {
          withCredentials: true,
        });
        setUser(userResponse.data);

        // Загрузка корзины - добавляем withCredentials
        const cartResponse = await axios.get('http://localhost:3001/cart', {
          withCredentials: true, // Это ключевое изменение
        });
        useCartStore.getState().setCart(cartResponse.data);
      } catch (err) {
        setError(t('errors.loading_error'));
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [setUser, t]);
  const handleCheckout = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        'http://localhost:3001/checkout',
        {},
        { withCredentials: true },
      );

      if (response.data.success) {
        useCartStore.getState().clearCart();
        // eslint-disable-next-line no-alert
        alert(`Заказ #${response.data.orderId} успешно оформлен!`);
        // Можно добавить редирект
        // router.push(`/orders/${response.data.orderId}`);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      // eslint-disable-next-line no-alert
      alert(
        (typeof err === 'object' && err !== null && 'response' in err)
          ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
          : 'Произошла ошибка при оформлении заказа',
      );
    } finally {
      setLoading(false);
    }
  };
  const handleRemoveFromCart = async (itemId: string) => {
    try {
      await axios.delete(`http://localhost:3001/cart/${itemId}`, {
        withCredentials: true,
      });
      removeItem(itemId);
    } catch (err) {
      setError(t('errors.remove_error'));
      console.error('Delete error:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Заголовок профиля */}
        <div className="bg-white rounded-lg mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {user?.username ? t('welcome_message', { username: user.username }) : t('profile')}
          </h1>
        </div>

        {/* Секция корзины */}
        <div className="bg-white rounded-lg p-4 mb-4">
          <h2 className="text-2xl font-semibold mb-6">{t('cart.title')}</h2>

          {cart.length === 0
            ? (
                <p className="text-gray-500 text-center">{t('cart.empty')}</p>
              )
            : (
                <div className="space-y-4">
                  {cart.map((item: CartItem) => (
                    <div key={item.id} className="flex items-center justify-between border-b pb-4">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="flex-1">
                          <h3 className="font-medium text-lg">{item.name}</h3>
                          <p className="text-gray-500">
                            {t('cart.quantity')}
                            :
                            {item.quantity}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <p className="font-medium text-xl">
                          {' '}
                          {/* Увеличено с text-lg до text-xl */}
                          {(item.price * item.quantity).toLocaleString('ru-RU', {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          })}
                          {' '}
                          ₸
                        </p>
                        <Button
                          variant="ghost"
                          size="default"
                          onClick={() => handleRemoveFromCart(item.id)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50 text-base"
                        >
                          <TrashIcon className="h-5 w-5 mr-2" />
                          {' '}
                          {/* Увеличено с h-4 w-4 */}
                          {t('cart.remove')}
                        </Button>
                      </div>
                    </div>
                  ))}

                  <div className="pt-6 mt-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">
                          {t('cart.total_items')}
                          :
                          {totalItems}
                        </p>
                        <p className="text-xl font-bold mt-2">
                          {t('cart.total_price')}
                          :
                          {' '}
                          {Number(totalPrice).toLocaleString('ru-RU', {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          })}
                          {' '}
                          ₸
                        </p>
                      </div>
                      <Button
                        className="bg-violet-600 text-white px-8 py-6 text-lg rounded-lg hover:bg-violet-700 transition-colors"
                        onClick={handleCheckout}
                      >
                        {t('cart.checkout')}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
