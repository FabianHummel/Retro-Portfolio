import { TypedText } from "@components/shared/TypedText";
import { Entry } from "@components/book/Entry";
import { Entries, Articles, getArticleHref } from "@data/Book";
import SolidMarkdown from "solid-markdown";
import { Component, For, createResource, createSignal, createEffect, onMount } from "solid-js";
import { Button } from "@components/book/Button";
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-light.css';
import { useParams } from "@solidjs/router";

const Book: Component = () => {

	const fetchArticle = async (index: number) => {
		let path = "/book/" + Articles[index].path;
		return await fetch(path).then(async res =>
			res.ok
				? res.text()
				: fetch("/book/404.md").then(res => res.text())
		)
	};

	const params = useParams();
	let section: HTMLDivElement;

	const [index, setIndex] = createSignal(0);
	const [article] = createResource(index, fetchArticle);

	createEffect(() => {
		article();
		hljs.highlightAll();
		
		if (params.chapter) {
			setIndex(Articles.findIndex(article => getArticleHref(article) === params.chapter))
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

							<div class="grid grid-cols-[1fr,1fr] gap-x-6 mt-8">
								{Articles[index() - 1] && <Button article={Articles[index() - 1]} class="col-start-1" />}
								{Articles[index() + 1] && <Button article={Articles[index() + 1]} class="col-start-2" />}
							</div>
						</>
					}
				</main>
			</article>
		</section>
	</>
}

export default Book;