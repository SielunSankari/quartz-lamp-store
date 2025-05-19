const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');
const expressSession = require('express-session');
const passport = require('passport');
const db = require('./db');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSession({ secret: 'InBrazilafemboystrangledamanwithhisass', resave: false, saveUninitialized: false }));

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(cookieParser('InBrazilafemboystrangledamanwithhisass'));

app.use(passport.initialize());
app.use(passport.session());
require('./passportConfig')(passport);

// Routes
app.post('/sign-up', (req, res) => {
  const insertQuery = 'INSERT INTO users (username, password) VALUES ($1, $2)';
  const selectQuery = 'SELECT * FROM users WHERE username = $1';

  // Проверяем, что username и password присутствуют в теле запроса
  if (!req.body.username || !req.body.password) {
    return res.status(400).send('Username and password are required');
  }

  db.query(selectQuery, [req.body.username], async (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send('Database error');
    }

    if (result.rows.length > 0) {
      return res.status(400).send('User already exists');
    }

    try {
      // Явно преобразуем password в строку, если это необходимо
      const password = String(req.body.password);
      const hashedPassword = await bcrypt.hash(password, 10);

      db.query(insertQuery, [req.body.username, hashedPassword], (err) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).send('Error creating user');
        }
        return res.status(201).send('User created successfully');
      });
    } catch (hashError) {
      console.error('Hashing error:', hashError);
      return res.status(500).send('Error processing password');
    }
  });
});

app.post('/sign-in', (req, res, next) => {
  passport.authenticate('local', (err, user, _info) => {
    if (err) {
      console.error(err);
    }
    if (!user) {
      res.send('User not found');
    }
    if (user) {
      req.login(user, (err) => {
        if (err) {
          console.error(err);
        }
        res.json({ username: user.username });
      });
    }
  })(req, res, next);
});

app.get('/getUser', (req, res) => {
  res.send(req.user);
});

app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Ошибка при выходе' });
    }

    res.clearCookie('connect.sid'); // имя по умолчанию
    res.status(200).json({ message: 'Успешно вышел' });
  });
});

// Получить все товары из корзины пользователя
app.get('/cart', (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Не авторизован' });
  }

  const userId = req.user.id;
  const query = `
    SELECT p.id, p.name, p.price, p.image_url, ci.quantity
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.id
    WHERE ci.user_id = $1
  `;

  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error('Ошибка получения корзины:', err);
      return res.status(500).send('Ошибка сервера');
    }
    res.json(result.rows);
  });
});

// Добавить товар в корзину
app.post('/cart', (req, res) => {
  // Проверка авторизации
  if (!req.user) {
    return res.status(401).json({ error: 'Требуется авторизация' });
  }

  // Валидация входных данных
  const { product_id, quantity } = req.body;
  if (!product_id || !quantity) {
    return res.status(400).json({ error: 'Не указаны product_id или quantity' });
  }

  const userId = req.user.id;

  // Проверка существования товара
  const productCheckQuery = 'SELECT id FROM products WHERE id = $1';
  db.query(productCheckQuery, [product_id], (err, productResult) => {
    if (err) {
      return res.status(500).json({ error: 'Ошибка проверки товара' });
    }

    if (productResult.rows.length === 0) {
      return res.status(404).json({ error: 'Товар не найден' });
    }

    // Основная логика
    const checkCartQuery = `
      SELECT * FROM cart_items
      WHERE user_id = $1 AND product_id = $2
    `;

    db.query(checkCartQuery, [userId, product_id], (err, cartResult) => {
      if (err) {
        return res.status(500).json({ error: 'Ошибка доступа к корзине' });
      }

      const insertQuery = `
        INSERT INTO cart_items (user_id, product_id, quantity)
        VALUES ($1, $2, $3)
        RETURNING *
      `;

      const updateQuery = `
        UPDATE cart_items
        SET quantity = quantity + $3
        WHERE user_id = $1 AND product_id = $2
        RETURNING *
      `;

      const executeQuery = cartResult.rows.length > 0
        ? { query: updateQuery, params: [userId, product_id, quantity] }
        : { query: insertQuery, params: [userId, product_id, quantity] };

      db.query(executeQuery.query, executeQuery.params, (err, result) => {
        if (err) {
          const errorMessage = cartResult.rows.length > 0
            ? 'Ошибка обновления количества'
            : 'Ошибка добавления в корзину';
          return res.status(500).json({ error: errorMessage });
        }

        res.status(200).json({
          message: cartResult.rows.length > 0
            ? 'Количество обновлено'
            : 'Товар добавлен в корзину',
          item: result.rows[0],
        });
      });
    });
  });
});

// Удалить товар из корзины
app.delete('/cart/:productId', (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Не авторизован' });
  }

  const userId = req.user.id;
  const productId = req.params.productId;

  const query = `DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2`;

  db.query(query, [userId, productId], (err) => {
    if (err) {
      console.error('Ошибка удаления товара из корзины:', err);
      return res.status(500).send('Ошибка сервера');
    }
    res.send('Товар удалён из корзины');
  });
});

app.get('/products', (req, res) => {
  const query = 'SELECT * FROM products ORDER BY id;';

  db.query(query, (err, result) => {
    if (err) {
      console.error('Ошибка при получении товаров:', err);
      return res.status(500).send('Ошибка при получении товаров');
    }
    res.json(result.rows);
  });
});

app.get('/products/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query('SELECT * FROM products WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Товар не найден' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.post('/checkout', async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const client = await db.connect();
  try {
    await client.query('BEGIN');

    // 1. Получаем товары из корзины с текущими ценами из products
    const { rows: cartItems } = await client.query(
      `SELECT
        ci.id as cart_item_id,
        ci.product_id,
        ci.quantity,
        p.price,
        p.name
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = $1`,
      [userId],
    );

    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // 2. Создаем запись заказа
    const orderRes = await client.query(
      'INSERT INTO orders(user_id) VALUES($1) RETURNING id',
      [userId],
    );
    const orderId = orderRes.rows[0].id;

    // 3. Добавляем товары в заказ
    for (const item of cartItems) {
      await client.query(
        `INSERT INTO order_items(
          order_id,
          product_id,
          quantity,
          price
        ) VALUES($1, $2, $3, $4)`,
        [orderId, item.product_id, item.quantity, item.price],
      );
    }

    // 4. Очищаем корзину
    await client.query(
      'DELETE FROM cart_items WHERE user_id = $1',
      [userId],
    );

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      orderId,
      message: 'Order created successfully',
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Checkout error:', err);
    res.status(500).json({
      error: 'Failed to create order',
      details: err.message,
    });
  } finally {
    client.release();
  }
});

app.get('/orders', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        o.id,
        o.user_id,
        o.created_at,
        json_agg(
          json_build_object(
            'id', oi.id,
            'product_id', oi.product_id,
            'name', p.name,
            'quantity', oi.quantity,
            'price', oi.price,
            'image_url', p.image_url
          )
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `);

    const orders = result.rows.map(order => ({
      ...order,
      items: order.items[0].id ? order.items : [],
    }));

    res.json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({
      error: 'Database error',
      details: err.message,
    });
  }
});

// Получение всех позиций заказов
app.get('/order-items', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        oi.*,
        p.name as product_name,
        p.image_url
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      ORDER BY oi.order_id
    `);

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching order items:', err);
    res.status(500).json({
      error: 'Database error',
      details: err.message,
    });
  }
});
// Get a single order with its items
app.get('/orders/:id', async (req, res) => {
  try {
    const orderId = req.params.id;

    // Get order details
    const orderResult = await db.query(
      'SELECT * FROM orders WHERE id = $1',
      [orderId],
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Get order items with product details
    const itemsResult = await db.query(`
      SELECT
        oi.*,
        p.name as product_name,
        p.image_url
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = $1
    `, [orderId]);

    res.json({
      ...orderResult.rows[0],
      items: itemsResult.rows,
    });
  } catch (err) {
    console.error('Error fetching order:', err);
    res.status(500).json({
      error: 'Database error',
      details: err.message,
    });
  }
});

// Get orders for current user
app.get('/user/orders', async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const userId = req.user.id;

    const result = await db.query(`
      SELECT
        o.id,
        o.created_at,
        json_agg(
          json_build_object(
            'id', oi.id,
            'product_id', oi.product_id,
            'name', p.name,
            'quantity', oi.quantity,
            'price', oi.price,
            'image_url', p.image_url
          )
        ) as items,
        SUM(oi.quantity * oi.price) as total_amount
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE o.user_id = $1
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `, [userId]);

    const orders = result.rows.map(order => ({
      ...order,
      items: order.items[0].id ? order.items : [],
      total_amount: order.total_amount || 0,
    }));

    res.json(orders);
  } catch (err) {
    console.error('Error fetching user orders:', err);
    res.status(500).json({
      error: 'Database error',
      details: err.message,
    });
  }
});

app.listen(3001, () => {
  console.warn('Server started on port 3001');
});
