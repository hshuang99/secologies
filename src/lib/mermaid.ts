import type { Parent, Root } from "mdast";

const escapeHtml = (text: string) => text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

/**
 * Remark plugin: turn ```mermaid code blocks into `<pre class="mermaid">` elements,
 * which the client script in `Mermaid.astro` renders into diagrams.
 * It runs before syntax highlighting, so the blocks are not highlighted as code.
 */
export default function mermaid() {
	return (tree: Root) => {
		const walk = (parent: Parent) => {
			parent.children.forEach((child, index) => {
				if (child.type === "code" && child.lang === "mermaid") {
					parent.children[index] = { type: "html", value: `<pre class="mermaid">${escapeHtml(child.value)}</pre>` };
				} else if ("children" in child) {
					walk(child as Parent);
				}
			});
		};

		walk(tree);
	};
}
