import type { APIRoute } from "astro";
import { buildAtomFeed } from "../utils/atom-builder";

// English Atom feed.
export const GET: APIRoute = async () => {
  return buildAtomFeed("en", "feed-en.xml");
};
