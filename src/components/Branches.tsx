'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { IoLocationOutline, IoOpenOutline } from 'react-icons/io5';

// Минимальные типы 2ГИС MapGL (чтобы не тащить any).
type MapglMap = {
  setCenter: (c: [number, number], opts?: object) => void;
  setZoom: (z: number, opts?: object) => void;
  destroy?: () => void;
};
type MapglMarker = { setCoordinates?: (c: [number, number]) => void };
type Mapgl = {
  Map: new (el: HTMLElement, opts: object) => MapglMap;
  Marker: new (map: MapglMap, opts: object) => MapglMarker;
};
declare global {
  // eslint-disable-next-line ts/consistent-type-definitions
  interface Window {
    mapgl?: Mapgl;
  }
}

type Branch = { key: string; coords: [number, number] };

// Координаты приблизительные — заменить на точные (правый клик в 2ГИС → координаты).
const BRANCHES: Branch[] = [
  { key: 'astana', coords: [71.4278, 51.1801] },
  { key: 'almaty', coords: [76.9286, 43.2567] },
  { key: 'karaganda', coords: [73.0877, 49.8047] },
  { key: 'pavlodar', coords: [76.9674, 52.2873] },
  { key: 'oskemen', coords: [82.6149, 49.9486] },
  { key: 'semey', coords: [80.2275, 50.4111] },
];

const MAP_KEY = process.env.NEXT_PUBLIC_2GIS_KEY;
const MARKER_ICON = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="38" height="48" viewBox="0 0 38 48"><path d="M19 0C8.5 0 0 8.5 0 19c0 13.1 17 27 19 29 2-2 19-15.9 19-29C38 8.5 29.5 0 19 0z" fill="#0284c7"/><circle cx="19" cy="19" r="7" fill="#fff"/></svg>',
)}`;

export default function Branches() {
  const t = useTranslations('Contacts');
  // Для динамических ключей (astana, astana_address и т.п.) — нестрогий доступ.
  const tx = t as unknown as (key: string) => string;
  const [active, setActive] = useState(0);
  const mapEl = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapglMap | null>(null);
  const markerRef = useRef<MapglMarker | null>(null);

  // Инициализация карты (только если задан ключ).
  useEffect(() => {
    if (!MAP_KEY || !mapEl.current) {
      return;
    }
    let destroyed = false;

    const init = () => {
      if (destroyed || !mapEl.current || !window.mapgl) {
        return;
      }
      const map = new window.mapgl.Map(mapEl.current, {
        center: BRANCHES[0]!.coords,
        zoom: 15,
        key: MAP_KEY,
        zoomControl: false,
      });
      mapRef.current = map;
      markerRef.current = new window.mapgl.Marker(map, {
        coordinates: BRANCHES[0]!.coords,
        icon: MARKER_ICON,
        anchor: [19, 48],
        size: [38, 48],
      });
    };

    if (window.mapgl) {
      init();
    } else {
      const id = 'mapgl-api';
      const existing = document.getElementById(id) as HTMLScriptElement | null;
      if (existing) {
        existing.addEventListener('load', init);
      } else {
        const s = document.createElement('script');
        s.id = id;
        s.src = 'https://mapgl.2gis.com/api/js/v1';
        s.async = true;
        s.addEventListener('load', init);
        document.body.appendChild(s);
      }
    }

    return () => {
      destroyed = true;
      mapRef.current?.destroy?.();
      mapRef.current = null;
    };
  }, []);

  // Смена города → плавный перелёт карты и перенос метки.
  useEffect(() => {
    const map = mapRef.current;
    const branch = BRANCHES[active]!;
    if (map) {
      map.setCenter(branch.coords, { duration: 600 });
      map.setZoom(16, { duration: 600 });
      markerRef.current?.setCoordinates?.(branch.coords);
    }
  }, [active]);

  const activeBranch = BRANCHES[active]!;
  const dgUrl = `https://2gis.kz/search/${encodeURIComponent(`${tx(activeBranch.key)} ${tx(`${activeBranch.key}_address`)}`)}`;

  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-sans text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
            {t('branches_title')}
          </h2>
          <p className="mx-auto mt-5 max-w-xl font-sans text-base leading-relaxed text-slate-500 md:text-lg">
            {t('branches_subtitle')}
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:mt-16 md:grid-cols-[300px_1fr]">
          {/* Список городов */}
          <div className="flex flex-col gap-2">
            {BRANCHES.map((b, i) => {
              const isActive = i === active;
              return (
                <button
                  key={b.key}
                  type="button"
                  onClick={() => setActive(i)}
                  className={`rounded-2xl border px-5 py-4 text-left transition-all duration-200 ${
                    isActive
                      ? 'border-sky-200 bg-white shadow-md'
                      : 'border-transparent bg-white/60 hover:bg-white hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <IoLocationOutline className={`h-4 w-4 shrink-0 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                    <span className="font-sans text-base font-semibold text-slate-900">{tx(b.key)}</span>
                  </div>
                  <p className="mt-1 pl-6 font-sans text-sm leading-relaxed text-slate-500">
                    {tx(`${b.key}_address`)}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Карта */}
          <div className="relative h-[360px] overflow-hidden rounded-3xl border border-slate-200/70 bg-slate-50 shadow-sm md:h-auto md:min-h-[460px]">
            {MAP_KEY
              ? (
                  <div ref={mapEl} className="h-full w-full" />
                )
              : (
                  // Fallback без ключа: адрес крупно + кнопка «Открыть в 2ГИС».
                  <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
                    <IoLocationOutline className="h-10 w-10 text-sky-600" />
                    <div>
                      <p className="font-sans text-lg font-semibold text-slate-900">{tx(activeBranch.key)}</p>
                      <p className="mx-auto mt-1 max-w-xs font-sans text-sm leading-relaxed text-slate-500">
                        {tx(`${activeBranch.key}_address`)}
                      </p>
                    </div>
                    <a
                      href={dgUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 font-sans text-sm font-medium text-slate-800 shadow-sm transition-all hover:shadow-md"
                    >
                      <IoOpenOutline className="h-4 w-4" />
                      {t('branches_open')}
                    </a>
                  </div>
                )}
          </div>
        </div>
      </div>
    </section>
  );
}
