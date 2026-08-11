import { buildRssFeed } from "../utils/rss-builder";

// English feed.
export async function GET() {
  return buildRssFeed("en");
}
