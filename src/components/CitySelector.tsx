'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { KZ_CITIES } from '@/libs/cities';
import { useCity } from '@/providers/CityProvider';
import { Check, ChevronDown } from 'lucide-react';
import { IoLocationOutline } from 'react-icons/io5';

// Выбор города в топ-баре. Привязан к аккаунту (см. CityProvider).
export function CitySelector() {
  const { city, setCity } = useCity();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Выбрать город"
          className="flex items-center gap-1.5 rounded-full px-1 py-0.5 font-sans text-sm text-slate-600 transition-colors hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/50"
        >
          <IoLocationOutline className="h-4 w-4 text-sky-600" />
          <span className="font-medium">{city}</span>
          <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="max-h-72 overflow-y-auto">
        {KZ_CITIES.map(c => (
          <DropdownMenuItem
            key={c}
            onSelect={() => setCity(c)}
            className="justify-between"
          >
            <span className="font-sans">{c}</span>
            {c === city && <Check className="h-4 w-4 text-sky-600" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
