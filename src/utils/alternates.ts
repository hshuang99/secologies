import { buildAlternates } from "@/utils/routes"
import type { PostEntry } from "@/utils/posts"

import { postPath } from "@/utils/posts"

export function postLocaleAlternates(post: Pick<PostEntry, "data" | "id">) {
  return buildAlternates(postPath(post))
}

