import { TypedText } from "@components/shared/TypedText";
import { Entry } from "@components/book/Entry";
import { Entries, Articles } from "@data/Book";
import SolidMarkdown from "solid-markdown";
import { Component, For, createResource, createSignal, createEffect } from "solid-js";
import { Button } from "@components/book/Button";
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-light.css';

export const [index, setIndex] = createSignal(0);

const fetchArticle = async (index: number) => {
	let path = "/book/" + Articles[index].path;
	return await fetch(path).then(async res =>
		res.ok
			? res.text()
			: fetch("/book/404.md").then(res => res.text())
	)
};

const Book: Component = () => {
	const [article] = createResource(index, fetchArticle);

	let section: HTMLDivElement;
	createEffect(() => {
		article();
		hljs.highlightAll();
	});

	createEffect(() => {
		index();
		window.scrollTo(0, section.offsetTop - 128);
	})

	return <>
		<section class="relative pt-52 pb-36 flex flex-col gap-5 justify-center items-center">
			<h1 class="title">
				<TypedText children="Docs and stories" />
			</h1>

			<p class="title">
				Things I want to preserve and <br />share with the world.
			</p>
		</section>

		<section ref={section} class="relative py-10 pl-6 pr-6 md:pr-24 grid md:grid-cols-[25rem,auto] gap-x-8">
			<div class="border-r-gray md:border-r-2">
				<aside class="sticky top-36 self-start pr-8 hidden md:block">
					<For each={Entries}>
						{(entry) =>
							<Entry entry={entry} />
						}
					</For>
				</aside>
			</div>
			<article class="overflow-auto">
				<main class="max-w-[1000px] mx-auto">
					{!article.loading &&
						<>
							<SolidMarkdown children={article()} />

							<div class="flex gap-x-6 mt-8">
								{Articles[index() - 1]
									? <Button index={index() - 1} />
									: <div class="flex-1 p-6" />}
								{Articles[index() + 1]
									? <Button index={index() + 1} />
									: <div class="flex-1 p-6" />}
							</div>
						</>
					}
				</main>
			</article>
		</section>
	</>
}

export default Book;