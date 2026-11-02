<script lang="ts">
import { onMount } from "svelte";
import Time from "$lib/time";
import i18nit from "$i18n";

interface Comment {
	id: number;
	author: string;
	content: string;
	createdAt: string;
}

const MAX_AUTHOR = 40;
const MAX_CONTENT = 2000;
const AUTHOR_KEY = "comment-author";

let { locale, slug }: { locale: string; slug: string } = $props();

const t = i18nit(locale);

let comments = $state<Comment[]>([]);
let loading = $state(true);
let loadFailed = $state(false);

let author = $state("");
let content = $state("");
let website = $state(""); // honeypot, real visitors never see or fill it
let submitting = $state(false);
let message = $state("");

async function load() {
	try {
		const response = await fetch(`/api/comments?slug=${encodeURIComponent(slug)}`);
		if (!response.ok) throw new Error(String(response.status));

		comments = (await response.json()).comments ?? [];
	} catch {
		loadFailed = true;
	} finally {
		loading = false;
	}
}

async function submit(event: SubmitEvent) {
	event.preventDefault();
	if (submitting) return;

	submitting = true;
	message = "";

	try {
		const response = await fetch("/api/comments", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ slug, author, content, website })
		});

		if (!response.ok) {
			message =
				response.status === 429
					? t("comments.error.rate")
					: response.status === 409
						? t("comments.error.duplicate")
						: t("comments.error.submit");
			return;
		}

		const { comment } = await response.json();
		if (comment) comments = [...comments, comment];
		content = "";

		try {
			localStorage.setItem(AUTHOR_KEY, author);
		} catch {}
	} catch {
		message = t("comments.error.submit");
	} finally {
		submitting = false;
	}
}

onMount(() => {
	try {
		author = localStorage.getItem(AUTHOR_KEY) ?? "";
	} catch {}

	load();
});
</script>

<section id="comments" class="flex flex-col gap-5">
	<h2 class="text-xl font-bold">
		{t("comments.title")}{#if comments.length} <span class="text-secondary text-base font-normal">({comments.length})</span>{/if}
	</h2>

	{#if loading}
		<p class="text-secondary">{t("comments.loading")}</p>
	{:else if loadFailed}
		<p class="text-secondary">{t("comments.error.load")}</p>
	{:else if !comments.length}
		<p class="text-secondary">{t("comments.empty")}</p>
	{:else}
		<ol class="flex flex-col gap-4">
			{#each comments as comment (comment.id)}
				<li class="flex flex-col gap-1 border-b border-weak pb-4">
					<div class="flex items-baseline gap-2">
						<span class="font-bold">{comment.author}</span>
						<time class="text-[0.875rem] text-secondary" datetime={comment.createdAt} title={Time.toLocaleString(comment.createdAt, navigator.language, true)}>
							{Time.toString(comment.createdAt)}
						</time>
					</div>
					<p class="whitespace-pre-wrap wrap-anywhere select-text">{comment.content}</p>
				</li>
			{/each}
		</ol>
	{/if}

	<form class="flex flex-col gap-3" onsubmit={submit}>
		<input
			class="bg-block rounded-md px-3 py-2 outline-none"
			type="text"
			name="author"
			required
			maxlength={MAX_AUTHOR}
			autocomplete="nickname"
			placeholder={t("comments.name")}
			aria-label={t("comments.name")}
			bind:value={author}
		/>
		<textarea
			class="bg-block rounded-md px-3 py-2 outline-none min-h-28 resize-y"
			name="content"
			required
			maxlength={MAX_CONTENT}
			placeholder={t("comments.content")}
			aria-label={t("comments.content")}
			bind:value={content}
		></textarea>
		<input class="hidden" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" bind:value={website} />
		<div class="flex items-center gap-3">
			<button class="font-bold text-background bg-secondary py-1 px-3 rounded-md disabled:opacity-50" type="submit" disabled={submitting}>
				{submitting ? t("comments.submitting") : t("comments.submit")}
			</button>
			{#if message}<span class="text-red-500 text-[0.875rem]" role="alert">{message}</span>{/if}
		</div>
	</form>
</section>
