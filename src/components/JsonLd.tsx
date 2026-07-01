// Встраивает разметку schema.org (JSON-LD) в разметку страницы.
// JSON.stringify + экранирование '<' защищает от выхода из тега <script>
// (данные товара приходят из Firestore — не полностью доверенный источник).
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react-dom/no-dangerously-set-innerhtml
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}
