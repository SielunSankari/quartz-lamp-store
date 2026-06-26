'use client';

import type { Map as LeafletMap, Marker as LeafletMarker } from 'leaflet';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { IoLocationOutline } from 'react-icons/io5';

type Branch = { key: string; coords: [number, number] }; // [lat, lng]

// Точные координаты филиалов (геокодинг по адресам).
const BRANCHES: Branch[] = [
  { key: 'astana', coords: [51.157724, 71.442084] },
  { key: 'almaty', coords: [43.284769, 76.935248] },
  { key: 'karaganda', coords: [49.823114, 73.115078] },
  { key: 'pavlodar', coords: [52.254062, 76.947146] },
  { key: 'oskemen', coords: [49.965246, 82.601058] },
  { key: 'semey', coords: [50.420233, 80.248830] },
];

// Фиолетовый маркер BAIMED (SVG-капля).
const PIN_SVG
  = '<svg width="30" height="40" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg">'
    + '<path d="M15 0C6.7 0 0 6.7 0 15c0 10.6 12.6 23.6 14 24.9.6.5 1.4.5 2 0C17.4 38.6 30 25.6 30 15 30 6.7 23.3 0 15 0z" fill="#6D5DF6"/>'
    + '<circle cx="15" cy="14.5" r="5.6" fill="#fff"/></svg>';

export default function Branches() {
  const t = useTranslations('Contacts');
  // Динамические ключи (astana, astana_address и т.п.) — нестрогий доступ.
  const tx = t as unknown as (key: string) => string;
  const [active, setActive] = useState(0);

  const mapEl = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<LeafletMarker[]>([]);

  // Инициализация карты (Leaflet + OpenStreetMap/CARTO, без ключей).
  useEffect(() => {
    let cancelled = false;
    import('leaflet').then(({ default: L }) => {
      if (cancelled || !mapEl.current || mapRef.current) {
        return;
      }

      const map = L.map(mapEl.current, {
        center: BRANCHES[0]!.coords,
        zoom: 12,
        scrollWheelZoom: false,
        attributionControl: true,
      });
      mapRef.current = map;

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        maxZoom: 19,
      }).addTo(map);

      const icon = L.divIcon({
        className: 'baimed-pin',
        html: PIN_SVG,
        iconSize: [30, 40],
        iconAnchor: [15, 40],
        popupAnchor: [0, -36],
      });

      markersRef.current = BRANCHES.map((b) => {
        const city = tx(b.key);
        const addr = tx(`${b.key}_address`);
        const dg = `https://2gis.kz/search/${encodeURIComponent(`${city} ${addr}`)}`;
        const html
          = `<div class="bm-popup-city">${city}</div>`
            + `<div class="bm-popup-addr">${addr}</div>`
            + `<a class="bm-popup-link" href="${dg}" target="_blank" rel="noopener noreferrer">${tx('branches_open')} →</a>`;
        return L.marker(b.coords, { icon }).addTo(map).bindPopup(html);
      });

      // Карта могла инициализироваться до финального размера контейнера.
      setTimeout(() => map.invalidateSize(), 0);
    });

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markersRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Смена города → плавный перелёт + открытие попапа.
  useEffect(() => {
    const map = mapRef.current;
    const marker = markersRef.current[active];
    if (map && marker) {
      map.flyTo(BRANCHES[active]!.coords, 15, { duration: 1.1 });
      marker.openPopup();
    }
  }, [active]);

  return (
    <section className="my-12 md:my-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-sans text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
            {t('branches_title')}
          </h2>
          <p className="mx-auto mt-5 max-w-xl font-sans text-base leading-relaxed text-slate-500 md:text-lg">
            {t('branches_subtitle')}
          </p>
        </div>

        {/* Выбор города */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {BRANCHES.map((b, i) => {
            const isActive = i === active;
            return (
              <button
                key={b.key}
                type="button"
                onClick={() => setActive(i)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 font-sans text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'border-brand/30 bg-brand/10 text-brand'
                    : 'border-slate-200/80 bg-white/70 text-slate-600 hover:bg-white hover:text-slate-900'
                }`}
              >
                <IoLocationOutline className="h-4 w-4" />
                {tx(b.key)}
              </button>
            );
          })}
        </div>

        {/* Карта на всю ширину блока. isolate — чтобы z-index Leaflet (зум,
            попапы до 1000) не перекрывали sticky-шапку (z-50). */}
        <div className="relative isolate mt-8 h-[460px] w-full overflow-hidden rounded-[2rem] border border-slate-200/70 shadow-sm md:h-[560px]">
          <div ref={mapEl} className="h-full w-full" />
        </div>
      </div>
    </section>
  );
}
