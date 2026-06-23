# Настройка магазина (Firebase + Stripe)

Пошаговая инструкция, чтобы поднять проект с нуля. Код уже написан —
тебе нужно создать облачные сервисы и вставить ключи.

---

## 1. Firebase (база данных + вход)

1. Зайди на <https://console.firebase.google.com> под своим Google-аккаунтом.
2. **Add project** → имя (например `baimed-shop`) → создать.
3. **Build → Authentication → Get started**:
   - вкладка **Sign-in method** → включи **Google** (Enable, выбери support email).
   - **Apple** включай позже, когда будет Apple Developer аккаунт (см. раздел 4).
4. **Build → Firestore Database → Create database**:
   - регион поближе (например `europe-west`);
   - режим — можно «production», правила зальём из `firestore.rules`.
5. **⚙ Project settings → General → Your apps → Web (`</>`)**:
   - зарегистрируй приложение → Firebase покажет объект `firebaseConfig`.
   - перенеси значения в `.env.local` (см. ниже, `NEXT_PUBLIC_FIREBASE_*`).
6. **⚙ Project settings → Service accounts → Generate new private key**:
   - скачается JSON. Из него возьми `project_id`, `client_email`, `private_key`
     для серверных переменных `FIREBASE_*`.

### Залить правила безопасности

Через Firebase CLI:

```bash
npm i -g firebase-tools
firebase login
firebase deploy --only firestore:rules
```

или просто скопируй содержимое `firestore.rules` в
**Firestore → Rules** в консоли и нажми Publish.

---

## 2. Переменные окружения

```bash
cp .env.example .env.local
```

Открой `.env.local` и заполни ключами Firebase и Stripe (подсказки — в комментариях файла).

---

## 3. Установка и запуск

```bash
npm install
npm run seed     # один раз: зальёт 6 товаров в Firestore
npm run dev      # старт на http://localhost:3000
```

> `npm run seed` требует заполненных `FIREBASE_*` (Admin) переменных в `.env.local`.

---

## 4. Apple-вход (опционально, позже)

Требует **платный Apple Developer аккаунт ($99/год)**. Кратко:

1. В Apple Developer создай **App ID** и **Services ID**, включи «Sign in with Apple».
2. Создай **Key** для Sign in with Apple, привяжи домен и Return URL
   (`https://<твой-проект>.firebaseapp.com/__/auth/handler`).
3. В Firebase → Authentication → Sign-in method → **Apple** введи Services ID,
   Apple Team ID, Key ID и приватный ключ.

Кнопка Apple в интерфейсе уже есть — она заработает сразу после включения провайдера.

---

## 5. Онлайн-оплата (Stripe)

1. Зарегистрируйся на <https://dashboard.stripe.com>, включи **Test mode**.
2. **Developers → API keys**: скопируй `pk_test_...` и `sk_test_...` в `.env.local`.
3. Локально запусти проброс вебхуков (в отдельном терминале):

   ```bash
   stripe login
   stripe listen --forward-to localhost:3000/api/webhook
   ```

   CLI покажет `whsec_...` — впиши его в `STRIPE_WEBHOOK_SECRET`.
4. Тестовая карта: `4242 4242 4242 4242`, любая будущая дата и CVC.

Поток оплаты: профиль → «Оформить заказ» → `/api/checkout` создаёт заказ
(статус `pending`) и Stripe-сессию → оплата на странице Stripe →
вебхук помечает заказ `paid` и очищает корзину.

---

## 6. Деплой (Vercel)

1. Импортируй репозиторий в Vercel.
2. Перенеси все переменные из `.env.local` в **Project → Settings → Environment Variables**.
3. `NEXT_PUBLIC_APP_URL` поставь на боевой домен.
4. В Stripe → Developers → Webhooks добавь эндпоинт `https://<домен>/api/webhook`
   на событие `checkout.session.completed`, секрет впиши в переменные Vercel.
5. В Firebase → Authentication → Settings → **Authorized domains** добавь свой домен.
