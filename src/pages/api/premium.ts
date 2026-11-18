import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = () =>
	new Response(JSON.stringify({ message: "Paid content goes here" }), {
		headers: { "Content-Type": "application/json" }
	});
