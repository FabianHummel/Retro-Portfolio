import { TypedText } from "@components/shared/TypedText";
import { Entry } from "@components/book/Entry";
import SolidMarkdown from "solid-markdown";
import {Component, For, createResource, createSignal, createEffect, onMount, Suspense, Show} from "solid-js";
import { Button } from "@components/book/Button";
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-light.css';
import { useParams } from "@solidjs/router";
import {Entries} from "@solid-primitives/keyed";
import {theme} from "@src/App";

export interface Entry {
	path?: string;
	children?: Book
}

export interface Book {
	[p: string]: Entry
}

const book = await fetch("/book/data.json").then(async res => await res.json() as Book).then(book => {
	const translate = (book: Book, path?: string): Book => Object.fromEntries(Object.entries(book).map(([title, entry]) => {
		if (entry.path) entry.path = path ? path + "/" + entry.path : entry.path;
		if (entry.children) entry.children = translate(entry.children, entry.path);
		return [title, entry];
	}));

	return translate(book);
});

const articles = (function flatten(book: Book) {
	return Object.entries(book).reduce((acc, [title, entry]) => {
		if (entry.path) acc.push({
			title: title,
			path: entry.path
		});
		if (entry.children) acc.push(...flatten(entry.children));
		return acc;
	}, []);
})(book);

const Book: Component = () => {
	async function fetchArticle (index: number) {
		let path = "/book/" + articles[index].path + ".md";
		return await fetch(path).then(async res => res.ok
			? res.text()
			: fetch("/book/404.md").then(res => res.text())
		)
	}

	const params = useParams();
	let section: HTMLDivElement;

	const [index, setIndex] = createSignal(0);
	const [article] = createResource(index, fetchArticle);

	createEffect(() => {
		hljs.highlightAll();

		if (params.chapter) {
			const indexByPath = articles.findIndex(article => article.path === decodeURIComponent(params.chapter));
			if (indexByPath === -1) {
				console.warn("Article " + decodeURIComponent(params.chapter) + " not found.");
				return;
			}
			setIndex(indexByPath);
			window.scrollTo(0, section.clientHeight - 128);
		}
	});

	return <>
		<section ref={section} class="relative pt-52 pb-36 flex flex-col gap-5 justify-center items-center">
			<h1 class="title">
				<TypedText children="Docs and stories" />
			</h1>

			<p class="title">
				Things I want to preserve and <br />share with the world.
			</p>
		</section>

		<section class="relative py-10 pl-6 pr-6 md:pr-24 grid md:grid-cols-[25rem,auto] gap-x-8">
			<div class="border-r-gray md:border-r-2">
				<aside class="sticky top-36 self-start pr-8 hidden md:block">
					<Suspense fallback="Loading...">
						<Entries of={book}>
							{(title, entry) => <Entry title={title} entry={entry()} index={index()} />}
						</Entries>
					</Suspense>
				</aside>
			</div>
			<article class="overflow-auto">
				<main class="max-w-[1000px] mx-auto">
					{!article.loading &&
						<>
							<Show when={theme()} keyed>
								{ theme => (
									<SolidMarkdown children={article()} transformImageUri={(src, alt) => {
										if (theme === "dark" && src.endsWith("?theme=light")) return "/book/blank.png";
										if (theme === "light" && src.endsWith("?theme=dark")) return "/book/blank.png";

										if (src.startsWith("http")) return src;
										// if (src.startsWith("/public")) return "/book" + src;
										return "/book/" + articles[index()].path.substring(0, articles[index()].path.lastIndexOf("/")) + "/" + src;
									}} />
								) }
							</Show>

							<div class="grid grid-cols-[1fr,1fr] gap-x-6 mt-8">
								{articles[index() - 1] && <Button title={articles[index() - 1].title} article={articles[index() - 1]} class="col-start-1" />}
								{articles[index() + 1] && <Button title={articles[index() + 1].title} article={articles[index() + 1]} class="col-start-2" />}
							</div>
						</>
					}
				</main>
			</article>
		</section>
	</>
}

export default Book;