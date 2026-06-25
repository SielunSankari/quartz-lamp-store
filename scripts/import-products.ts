/**
 * Импорт реальных товаров BAIMED (источник данных — карточки Kaspi компании).
 * Запуск: npm run import:products
 *
 * set(..., { merge: true }) по id → товар создаётся или обновляется (идемпотентно).
 * Изображения берутся локально из public/assets/images/products.
 */
import type { Product } from '../src/types/shop';
import { config } from 'dotenv';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

config({ path: '.env.local' });

const products: Product[] = [
  {
    id: 'baimed-obluchatel-18',
    name: 'BAIMED облучатель бактерицидный 18 Ватт',
    description:
      'Бактерицидный облучатель открытого типа BAIMED мощностью 18 Вт для УФ-обеззараживания воздуха и поверхностей в помещениях до 20 м². Нейтрализует вирусы, бактерии и грибки.',
    price: 12000,
    imageUrl: '/assets/images/products/obluchatel-18-1.jpg',
    alt: 'BAIMED облучатель бактерицидный 18 Ватт, открытого типа',
    images: [
      '/assets/images/products/obluchatel-18-1.jpg',
      '/assets/images/products/obluchatel-18-2.jpg',
      '/assets/images/products/obluchatel-18-3.jpg',
      '/assets/images/products/obluchatel-18-4.jpg',
    ],
    specs: [
      { label: 'Тип', value: 'Облучатель открытого типа' },
      { label: 'Потребляемая мощность', value: '18 Вт' },
      { label: 'Мощность лампы', value: '18 Вт' },
      { label: 'Количество ламп', value: '1' },
      { label: 'Питание', value: '220 В · 50 Гц' },
      { label: 'Длина', value: '60 см' },
      { label: 'Площадь обработки', value: 'до 20 м²' },
      { label: 'Срок службы лампы', value: '8 000 часов' },
      { label: 'Крепление', value: 'Настенно-потолочное' },
      { label: 'Особенности', value: 'Открытый тип, с озоном' },
      { label: 'Комплектация', value: 'Облучатель, лампа (1 шт.)' },
      { label: 'Страна-производитель', value: 'Китай' },
    ],
    details: {
      summary:
        'Бактерицидный облучатель открытого типа BAIMED — надёжное решение для ультрафиолетового обеззараживания воздуха и поверхностей в помещениях до 20 м². УФ-лампа мощностью 18 Вт эффективно нейтрализует вирусы, бактерии и грибки, помогая поддерживать чистую и безопасную среду дома, в клинике или в офисе.',
      advantages: [
        'Уничтожает до 99,9% вирусов, бактерий и грибков',
        'Покрытие помещений площадью до 20 м²',
        'Озоновый эффект — дезинфекция труднодоступных зон',
        'Настенно-потолочное крепление — не занимает полезную площадь',
        'Ресурс лампы до 8 000 рабочих часов',
        'Тихая работа и простое управление',
      ],
      usage: [
        'Квартиры и дома, детские комнаты',
        'Медицинские кабинеты, клиники и лаборатории',
        'Офисы, салоны красоты, кабинеты косметологии',
        'Магазины, кафе и помещения с потоком людей',
      ],
      safety: [
        'Облучатель открытого типа — включайте только в отсутствие людей, животных и растений в помещении.',
        'Модель с озоном: после сеанса проветрите помещение 15–20 минут.',
        'Не смотрите на включённую лампу — УФ-излучение вредно для глаз и кожи.',
        'Соблюдайте время обработки в зависимости от площади согласно инструкции.',
      ],
    },
  },
];

async function main() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error('Заполни FIREBASE_* в .env.local перед запуском импорта.');
  }
  if (!getApps().length) {
    initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
  }

  const db = getFirestore();
  for (const { id, ...data } of products) {
    const ref = db.collection('products').doc(id);
    const existed = (await ref.get()).exists;
    await ref.set(data, { merge: true });

    console.log(`${existed ? '♻️  обновлён' : '🆕 создан'}: ${id}`);
  }

  console.log(`✅ Импортировано товаров: ${products.length}`);
}

main().catch((err) => {
  console.error('❌ Ошибка импорта:', err);
  process.exit(1);
});
