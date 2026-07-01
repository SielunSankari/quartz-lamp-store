// Скелет каталога — показывается, пока идёт ISR-рендер / загрузка данных.
// Держит стабильный лейаут (без сдвигов CLS) во время ожидания.
export default function Loading() {
  return (
    <div className="-mx-4 sm:-mx-6 md:-mx-12 lg:-mx-24 xl:-mx-36 2xl:-mx-48">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-8">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-[repeat(auto-fill,minmax(280px,1fr))] sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              // eslint-disable-next-line react/no-array-index-key
              key={i}
              className="flex flex-col overflow-hidden rounded-[1.5rem] border border-white/60 bg-white/60"
            >
              <div className="h-40 w-full animate-pulse bg-slate-100 sm:h-52" />
              <div className="flex flex-1 flex-col gap-2 p-3 sm:p-5">
                <div className="h-4 w-3/4 animate-pulse rounded bg-slate-100" />
                <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
                <div className="mt-2 h-5 w-1/3 animate-pulse rounded bg-slate-100" />
                <div className="mt-3 h-11 w-full animate-pulse rounded-full bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
