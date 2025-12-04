import { redirect, notFound } from "next/navigation";

import { getDocFiles } from "@/lib/docs";

export default async function DocsIndex() {
  const files = await getDocFiles();
  if (!files.length) {
    throw notFound();
  }
  redirect(files[0].href);
}
