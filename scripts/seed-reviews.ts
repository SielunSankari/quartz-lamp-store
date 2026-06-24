/**
 * Заполняет коллекцию `reviews` 20 отзывами (демо-данные).
 * Запуск: npm run seed:reviews
 *
 * Требует FIREBASE_* (Admin) в .env.local. Admin SDK пишет в обход правил.
 * Документы с id seed-* не конфликтуют с реальными отзывами (id = uid).
 */
import { config } from 'dotenv';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

config({ path: '.env.local' });

// Палитра аватаров (как в src/libs/avatarColor.ts).
const AVATAR_COLORS = [
  '#6C8EBF',
  '#E07A5F',
  '#81B29A',
  '#9A8C98',
  '#5C9EAD',
  '#B084CC',
  '#E0A458',
  '#5E8C7E',
  '#D88C9A',
  '#7C9D96',
];
function colorFromName(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]!;
}

const REVIEWS: { name: string; city: string; rating: number; text: string }[] = [
  { name: 'Айгерим', city: 'Алматы', rating: 5, text: 'брала для детской, кварцую пока сына нет дома. спокойнее так) и доставили на след день' },
  { name: 'Сергей', city: 'Астана', rating: 5, text: 'Берём в офис второй год. зимой реально меньше болеем, тьфу-тьфу' },
  { name: 'Данияр', city: 'Караганда', rating: 4, text: 'норм лампа, мощная. упаковка только так себе была, а в остальном всё ок' },
  { name: 'Ольга', city: 'Павлодар', rating: 5, text: 'поставила в стоматологии, пациенты говорят что свежо. сертификаты дали — это важно' },
  { name: 'Нұрлан', city: 'Шымкент', rating: 5, text: 'купил после того как вся семья переболела… теперь раз в неделю кварцую, спокойнее' },
  { name: 'Наталья', city: 'Усть-Каменогорск', rating: 4, text: 'качество хорошее, озон чувствуется. проветриваю потом. своих денег стоит' },
  { name: 'Ержан', city: 'Семей', rating: 5, text: 'взял в кафе, гости довольны. рекомендую кто в общепите' },
  { name: 'Динара', city: 'Алматы', rating: 5, text: 'ребёнок в саду постоянно простывал, с лампой полегче стало. спасибо что помогли с выбором!' },
  { name: 'Дмитрий', city: 'Астана', rating: 4, text: 'брал облучатель на склад, справляется. по городу привезли быстро' },
  { name: 'Гүлнара', city: 'Костанай', rating: 5, text: 'очень довольна) светит мощно, корпус крепкий. маме брала, сама разобралась' },
  { name: 'Тимур', city: 'Караганда', rating: 5, text: 'работает как часы, взял ещё один родителям в подарок' },
  { name: 'Елена', city: 'Алматы', rating: 5, text: 'пользуюсь дома после болезни, воздух прям другой. менеджеры норм подсказали по мощности' },
  { name: 'Бауыржан', city: 'Актобе', rating: 4, text: 'делает своё дело. хотелось бы подставку в комплекте, но в целом доволен' },
  { name: 'Мадина', city: 'Шымкент', rating: 5, text: 'поставили в детский центр, родители спокойнее. все доки на месте' },
  { name: 'Андрей', city: 'Павлодар', rating: 5, text: 'для парикмахерской брал, клиентам нравится что следим за гигиеной' },
  { name: 'Әсел', city: 'Астана', rating: 5, text: 'тихая, аккуратная. кварцую детскую перед сном, утром свежо. лучшее что покупала в этом году' },
  { name: 'Алексей', city: 'Семей', rating: 4, text: 'мощно. главное из комнаты выходить и по инструкции, тогда всё супер' },
  { name: 'Жанна', city: 'Алматы', rating: 5, text: 'заказала в клинику, пациенты отмечают чистоту. для нас EAC решает' },
  { name: 'Дамир', city: 'Караганда', rating: 5, text: 'по совету друга взял, не пожалел) доставка, гарантия — всё по-человечески' },
  { name: 'Марина', city: 'Усть-Каменогорск', rating: 5, text: 'отличная для дома, дети болеют реже. рекомендую однозначно' },
];

async function main() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error('Заполни FIREBASE_* в .env.local перед запуском сида.');
  }
  if (!getApps().length) {
    initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
  }

  const db = getFirestore();
  const batch = db.batch();
  const now = Date.now();
  const dayMs = 86_400_000;

  REVIEWS.forEach((r, i) => {
    const id = `seed-${i + 1}`;
    // createdAt по убыванию (новые — первыми) + лёгкий «органичный» разброс.
    const createdAt = now - Math.round((i * 1.7 + Math.random() * 0.9) * dayMs);
    batch.set(db.collection('reviews').doc(id), {
      userId: id,
      userName: r.name,
      userAvatarColor: colorFromName(r.name),
      rating: r.rating,
      text: r.text,
      city: r.city,
      createdAt,
    });
  });

  await batch.commit();

  console.log(`✅ Загружено отзывов: ${REVIEWS.length}`);
}

main().catch((err) => {
  console.error('❌ Ошибка сида отзывов:', err);
  process.exit(1);
});
