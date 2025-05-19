// db.js
const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  user: 'postgres', // обычно 'postgres' по умолчанию
  password: '4444', // замените на ваш пароль
  database: 'baimed_db',
  port: 5432, // стандартный порт PostgreSQL
  max: 10, // максимальное количество клиентов в пуле
});

// Проверка подключения к базе данных
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Ошибка подключения к PostgreSQL:', err);
    return;
  }
  console.warn('Успешное подключение к PostgreSQL, текущее время сервера:', res.rows[0].now);
});

// Экспортируем пул подключений
module.exports = pool;
