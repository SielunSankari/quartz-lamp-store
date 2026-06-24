module.exports = {
  // Линтим только код/текст — НЕ бинарные файлы (png, jpg и т.п.),
  // иначе lint-staged падает на путях к картинкам.
  '*.{js,jsx,ts,tsx,mjs,cjs}': ['eslint --fix --no-warn-ignored'],
  '*.{json,jsonc,css,md,yml,yaml}': ['eslint --fix --no-warn-ignored'],
  '**/*.ts?(x)': () => 'npm run check-types',
};
