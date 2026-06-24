// Детерминированный приятный «эпловский» цвет аватара из имени.
// Одно имя → всегда один цвет. Общий util, чтобы не дублировать логику.
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

export function avatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]!;
}
