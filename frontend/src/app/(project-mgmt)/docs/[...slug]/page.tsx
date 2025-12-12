import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { cn } from "@/lib/utils";
import { buildDocTree, DocNode, getDocFiles, loadDocContent } from "@/lib/docs";

type Params = {
  slug?: string[];
};

const accentMap: Record<string, string> = {
  scripts: "Scripts",
};

function formatSectionName(name: string) {
  if (!name) return "Documentation";
  return accentMap[name] ?? name.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function renderNav(node: DocNode) {
  return (
    <div className="space-y-4" key={node.name}>
      {node.name && (
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
          {formatSectionName(node.name)}
        </p>
      )}
      <div className="space-y-2">
        {[...node.files]
          .sort((a, b) => a.label.localeCompare(b.label))
          .map((file) => (
            <Link
              href={file.href}
              key={file.href}
              className={cn(
                "block rounded-lg px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent/70",
                file.isActive ? "bg-accent text-white" : "text-muted-foreground"
              )}
            >
              {file.label}
            </Link>
          ))}
      </div>
      {Object.values(node.children).map((child) => (
        <div key={child.name} className="pl-2">
          {renderNav(child)}
        </div>
      ))}
    </div>
  );
}

export default async function DocsPage({
  params,
}: {
  params?: Promise<Params>;
}) {
  const resolvedParams = params ? await params : undefined;
  const files = await getDocFiles();

  if (files.length === 0) {
    throw notFound();
  }

  const defaultSlug = files[0].slug.join("/");
  const slugParts = resolvedParams?.slug ?? [];
  const currentSlug = slugParts.length ? slugParts.join("/") : defaultSlug;
  const matchedDoc = files.find((doc) => doc.slug.join("/") === currentSlug);
  if (!matchedDoc) {
    throw notFound();
  }

  const markdown = await loadDocContent(matchedDoc);
  const tree = buildDocTree(files, currentSlug);

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <aside className="bg-card rounded-3xl border border-border p-4 shadow-lg shadow-muted/20">
        {renderNav(tree)}
      </aside>

      <section className="space-y-4 rounded-3xl border border-border bg-primary p-6 shadow-lg shadow-muted/30">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Docs</p>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">{matchedDoc.label}</h1>
          </div>
          <Link
            href="https://github.com/MeganHarrison/alleato-procore"
            className="rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-foreground hover:text-foreground"
          >
            View repo
          </Link>
        </div>

        <div className="prose max-w-none text-muted-foreground">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
        </div>
      </section>
    </div>
  );
}
