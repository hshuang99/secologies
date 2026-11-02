<script lang="ts">
import { untrack } from "svelte";
import { flip } from "svelte/animate";
import Time from "$lib/time";
import Pagination from "$components/Pagination.svelte";
import i18nit from "$i18n";

/**
 * Filterable list with series and tag panels, shared by the project and podcast sections.
 * Mirrors the note list: filters are kept in the URL (?series=…&tag=…&page=…).
 */
let {
	locale,
	section,
	entries,
	series: seriesList,
	tags: tagList
}: { locale: string; section: "project" | "podcast"; entries: any[]; series: string[]; tags: string[] } = $props();

const t = i18nit(locale);

/** Pagination size */
const size: number = 15;

/** Track initial load to parse URL parameters */
let initial = $state(true);

let pages: number = $state(1);
let page: number = $state(1);
let pageParam: boolean = $state(false);
let series: string | null = $state(null);
let tags: string[] = $state([]);

/** Toggle tag inclusion/exclusion in the filter list */
function switchTag(tag: string, turn?: boolean) {
	let included = tags.includes(tag);
	if (turn === undefined) turn = !included;

	tags = turn ? (included ? tags : [...tags, tag]) : tags.filter(item => item !== tag);

	// Reset page parameter
	pageParam = false;
	page = 1;
}

/** Select or deselect a series filter (only one series can be active at a time) */
function chooseSeries(seriesChoice: string, turn?: boolean) {
	if (turn === undefined) turn = series !== seriesChoice;
	series = turn ? seriesChoice : null;

	// Reset page parameter
	pageParam = false;
	page = 1;
}

/** Filtered and paginated list of entries */
let list: any[] = $derived.by(() => {
	let filtered: any[] = entries
		.filter(entry => (!series || entry.data.series === series) && tags.every(tag => entry.data.tags?.includes(tag)))
		// Sort by timestamp (newest first)
		.sort((a, b) => b.data.timestamp.getTime() - a.data.timestamp.getTime());

	untrack(() => {
		// Ensure page is within valid range
		pages = Math.ceil(filtered.length / size);
		page = Math.max(1, Math.min(Math.floor(page), pages));
	});

	return filtered.slice((page - 1) * size, page * size);
});

$effect(() => {
	if (initial) {
		// Parse URL parameters when component is first mounted
		const params = new URLSearchParams(window.location.search);

		if (params.get("page") !== null) {
			pageParam = true;
			const value = Number(params.get("page"));
			page = Number.isNaN(value) ? 1 : value;
		}

		series = params.get("series");
		tags = params.getAll("tag");

		initial = false;
	} else {
		// Build URL with current page, series, and tag filters using URLSearchParams
		const url = new URL(window.location.href);
		url.searchParams.delete("series");
		url.searchParams.delete("tag");
		url.searchParams.delete("page");

		if (series) url.searchParams.set("series", series);
		for (const tag of tags) url.searchParams.append("tag", tag);

		if (page > 1) pageParam = true;
		if (pageParam) url.searchParams.set("page", String(page));

		// Match https://github.com/swup/swup/blob/main/src/helpers/history.ts#L22
		window.history.replaceState({ url: url.toString(), random: Math.random(), source: "swup" }, "", url);
	}
});
</script>

<div class="flex flex-col-reverse sm:flex-row gap-10 grow">
	<article class="flex flex-col gap-5 grow">
		{#each list as entry (entry.id)}
			<section animate:flip={{ duration: 150 }} class="flex flex-col">
				<div class="*:inline *:align-middle font-bold">
					{#if entry.data.series}
						<button onclick={() => chooseSeries(entry.data.series, true)}>{entry.data.series}</button>
						<span aria-hidden="true">|</span>
					{/if}
					<a href={entry.url} class="link">{entry.data.title}</a>
				</div>
				{#if entry.data.description}
					<p class="text-sm text-secondary line-clamp-2">{entry.data.description}</p>
				{/if}
				<span class="inline-flex gap-1 flex-wrap">
					{#each entry.data.tags ?? [] as tag}
						<button onclick={() => switchTag(tag, true)} class="text-secondary text-sm">#{tag}</button>
					{/each}
				</span>
				<time datetime={entry.data.timestamp.toISOString()} class="mt-1 font-mono text-[0.65rem] text-secondary">
					{#if entry.data.episode}{t("podcast.episode", { count: entry.data.episode })} · {/if}{Time.toString(entry.data.timestamp)}
				</time>
			</section>
		{:else}
			<div class="pt-[10vh] text-center text-secondary font-bold text-xl">{t(`${section}.empty`)}</div>
		{/each}

		<Pagination bind:pages bind:page />
	</article>

	<aside class="sm:basis-50 shrink-0 flex flex-col gap-5">
		<section>
			<h4>{t("note.series")}</h4>
			<p>
				{#each seriesList as seriesItem (seriesItem)}
					<button class:selected={seriesItem == series} onclick={() => chooseSeries(seriesItem)}>{seriesItem}</button>
				{/each}
			</p>
		</section>

		<section>
			<h4>{t("note.tag")}</h4>
			<p>
				{#each tagList as tag (tag)}
					<button class:selected={tags.includes(tag)} onclick={() => switchTag(tag)}>{tag}</button>
				{/each}
			</p>
		</section>
	</aside>
</div>

<style>
aside {
	section {
		display: flex;
		flex-direction: column;
		gap: 5px;

		p {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			gap: 5px;

			button {
				border-bottom: 1px solid var(--primary-color);
				padding: 0rem 0.35rem;
				font-size: 0.9rem;
				transition:
					color 0.1s ease-in-out,
					background-color 0.1s ease-in-out;

				&.selected {
					color: var(--background-color);
					background-color: var(--primary-color);
				}

				@media (min-width: 640px) {
					&:hover {
						color: var(--background-color);
						background-color: var(--primary-color);
					}
				}
			}
		}
	}
}
</style>
