import { buildRssFeed } from "../utils/rss-builder";

// Chinese (site default language) feed.
export async function GET() {
  return buildRssFeed("zh");
}
