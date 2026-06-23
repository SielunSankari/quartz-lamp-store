/**
 * Заполняет коллекцию `products` в Firestore 6 товарами.
 * Запуск: npm run seed
 *
 * Требует переменных FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY
 * в .env.local (Admin SDK пишет в обход Security Rules).
 *
 * Картинки берутся из локальной папки public/assets/images — внешний хостинг не нужен.
 */
import { config } from 'dotenv';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

config({ path: '.env.local' });

const products = [
  {
    id: 'kvarc-15',
    name: 'Кварцевая лампа КВ-15',
    description: 'Бытовая кварцевая лампа для дезинфекции помещений до 15 м². В комплекте сертификат и инструкция.',
    price: 18000,
    imageUrl: '/assets/images/lamp.png',
  },
  {
    id: 'obluchatel-open',
    name: 'Облучатель открытого типа ОБН-150',
    description: 'Бактерицидный облучатель открытого типа для медицинских и промышленных помещений.',
    price: 32000,
    imageUrl: '/assets/images/Obluchatel.png',
  },
  {
    id: 'kvarc-30',
    name: 'Кварцевая лампа КВ-30',
    description: 'Мощная кварцевая лампа для помещений до 30 м². Озонирующая, ресурс до 12 000 часов.',
    price: 27000,
    imageUrl: '/assets/images/lamp.png',
  },
  {
    id: 'recirculator',
    name: 'Рециркулятор воздуха РБ-01',
    description: 'Закрытый рециркулятор — обеззараживает воздух в присутствии людей. Тихий, безопасный.',
    price: 45000,
    imageUrl: '/assets/images/Box.png',
  },
  {
    id: 'uv-portable',
    name: 'Портативная УФ-лампа',
    description: 'Компактная ультрафиолетовая лампа для дома, авто и поездок. Работает от USB.',
    price: 9000,
    imageUrl: '/assets/images/thumbs-up-man.png',
  },
  {
    id: 'uv-pro-kit',
    name: 'Профессиональный УФ-комплект',
    description: 'Набор для клиник: облучатель, сменная лампа и защитные очки. Полный пакет документов.',
    price: 58000,
    imageUrl: '/assets/images/Attestat-UF-lampyi.png',
  },
];

async function main() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error('Заполни FIREBASE_* переменные в .env.local перед запуском сида.');
  }

  if (!getApps().length) {
    initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
  }

  const db = getFirestore();
  const batch = db.batch();

  for (const { id, ...data } of products) {
    batch.set(db.collection('products').doc(id), data);
  }

  await batch.commit();

  console.log(`✅ Загружено товаров: ${products.length}`);
}

main().catch((err) => {
  console.error('❌ Ошибка сида:', err);
  process.exit(1);
});
