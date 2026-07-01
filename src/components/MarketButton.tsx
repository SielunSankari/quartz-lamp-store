import { Lock } from 'lucide-react';

// Кнопка маркетплейса (Kaspi / Halyk).
//  • есть ссылка → активная цветная кнопка-ссылка (открывается в новой вкладке);
//  • ссылки нет → «заблокированный» вид: серая, некликабельная, с замочком.
type Props = {
  url?: string;
  label: string;
  unavailableLabel: string; // подсказка при наведении на неактивную кнопку
  activeClass: string; // фирменный цвет активной кнопки, напр. 'bg-[#F14635] hover:bg-[#d83a2c]'
  className?: string; // размеры/типографика (общая форма)
};

export function MarketButton({ url, label, unavailableLabel, activeClass, className }: Props) {
  const base = `flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full font-sans font-medium transition-all duration-200 ${className ?? ''}`;

  if (url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`${base} ${activeClass} text-white hover:shadow-sm`}
      >
        {label}
      </a>
    );
  }

  return (
    <span
      aria-disabled="true"
      title={unavailableLabel}
      className={`${base} cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400`}
    >
      <Lock className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
      {label}
    </span>
  );
}
