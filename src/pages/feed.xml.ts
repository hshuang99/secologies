import type { APIRoute } from "astro";
import { buildAtomFeed } from "../utils/atom-builder";

// Chinese (site default language) Atom feed.
export const GET: APIRoute = async () => {
  return buildAtomFeed("zh", "feed.xml");
};
