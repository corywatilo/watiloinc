import Link from "next/link";

export const TOC_ITEMS = [
  { label: "Biography", page: 1, href: "#biography" },
  { label: "Team", page: 2, href: "#team" },
  { label: "Work", page: 3, href: "#work" },
  { label: "Facts", page: 4, href: "#facts" },
  { label: "Hot takes", page: 5, href: "#hot-takes" },
  { label: "Handbook", page: 6, href: "#handbook" },
  { label: "Changelog", page: 7, href: "#changelog" },
  { label: "Roadmap", page: 8, href: "#roadmap" },
  { label: "Contact", page: 9, href: "#contact" },
] as const;

export type TocPage = (typeof TOC_ITEMS)[number]["page"];

const rowClass =
  "flex items-baseline gap-4 font-display text-xl font-bold leading-normal sm:text-2xl";

function TocRow({
  label,
  page,
  href,
  isCurrent,
}: {
  label: string;
  page: number;
  href: string;
  isCurrent: boolean;
}) {
  if (isCurrent) {
    return (
      <li aria-current="page">
        <span className={rowClass}>
          <span className="shrink-0 underline decoration-1 underline-offset-2">
            {label}
          </span>
          <span className="toc-leader" aria-hidden />
          <span className="shrink-0 tabular-nums">{page}</span>
        </span>
      </li>
    );
  }

  return (
    <li>
      <Link href={href} className={`${rowClass} no-underline`}>
        <span className="shrink-0">{label}</span>
        <span className="toc-leader" aria-hidden />
        <span className="shrink-0 tabular-nums">{page}</span>
      </Link>
    </li>
  );
}

export function TableOfContents({
  currentPage,
  className,
}: {
  currentPage?: TocPage;
  className?: string;
}) {
  return (
    <section className={className}>
      <h2 className="text-center font-display text-2xl font-bold uppercase">
        Table of contents
      </h2>
      <ol className="mt-10 flex flex-col gap-4">
        {TOC_ITEMS.map((item) => (
          <TocRow
            key={item.label}
            {...item}
            isCurrent={item.page === currentPage}
          />
        ))}
      </ol>
    </section>
  );
}
