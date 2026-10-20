import Link from 'next/link';

export interface PublicBreadcrumbItem {
  label: string;
  href?: string;
}

export function PublicBreadcrumbs({ items }: { items: PublicBreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-neo-black/65">
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="inline-flex items-center gap-2">
          {index > 0 && <span aria-hidden="true">/</span>}
          {item.href ? (
            <Link href={item.href} className="underline decoration-neo-blue decoration-2 underline-offset-4 hover:text-neo-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neo-blue">
              {item.label}
            </Link>
          ) : (
            <span aria-current="page" className="text-neo-black">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
