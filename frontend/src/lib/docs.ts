import { promises as fs } from "fs";
import path from "path";

export type DocFile = {
  slug: string[];
  href: string;
  label: string;
  relativePath: string;
  isActive?: boolean;
};

export type DocNode = {
  name: string;
  files: DocFile[];
  children: Record<string, DocNode>;
};

const DOCS_DIR = path.join(process.cwd(), "..", "docs");

export async function getDocFiles(): Promise<DocFile[]> {
  const files: DocFile[] = [];
  await recurse(DOCS_DIR, []);
  return files;

  async function recurse(dir: string, segments: string[]) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    entries.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

    for (const entry of entries) {
      if (entry.name.startsWith(".") || entry.name === "node_modules") continue;
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        await recurse(fullPath, [...segments, entry.name]);
        continue;
      }

      if (!entry.name.match(/\.md$|\.markdown$/i)) continue;

      const relativePath = path.relative(DOCS_DIR, fullPath);
      const slugParts = relativePath
        .replace(/\\/g, "/")
        .replace(/\.md$/i, "")
        .replace(/\.markdown$/i, "")
        .split("/")
        .map((segment) => segment.replace(/\s+/g, "-"));

      const href = `/docs/${slugParts.join("/")}`;
      files.push({
        slug: slugParts,
        href,
        label: formatLabel(entry.name),
        relativePath: fullPath,
      });
    }
  }
}

export function buildDocTree(files: DocFile[], currentSlug: string): DocNode {
  const root: DocNode = { name: "", files: [], children: {} };

  for (const file of files) {
    const slugKey = file.slug.join("/");
    file.isActive = slugKey === currentSlug;
    let cursor = root;

    for (let i = 0; i < file.slug.length - 1; i++) {
      const part = file.slug[i];
      if (!cursor.children[part]) {
        cursor.children[part] = { name: part, files: [], children: {} };
      }
      cursor = cursor.children[part];
    }

    cursor.files.push(file);
  }

  return root;
}

export async function loadDocContent(doc: DocFile): Promise<string> {
  return fs.readFile(doc.relativePath, "utf-8");
}

function formatLabel(filename: string): string {
  return filename
    .replace(/\.md$/i, "")
    .replace(/\.markdown$/i, "")
    .replace(/[-_]/g, " ")
    .replace(/^\s+|\s+$/g, "")
    .replace(/\bREADME\b/i, "Overview")
    .replace(/\bCLAUDE\b/i, "Claude instructions")
    .replace(/\bTASKS\b/i, "Tasks");
}
