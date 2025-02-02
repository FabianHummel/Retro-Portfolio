import { TypedText } from "@components/shared/TypedText";
import { Entry } from "@components/book/Entry";
import SolidMarkdown from "solid-markdown";
import {Component, createResource, createSignal, createEffect, Suspense, Show, on, onMount} from "solid-js";
import { Button } from "@components/book/Button";
import hljs from 'highlight.js';
import light from 'highlight.js/styles/atom-one-light.css?raw';
import dark from 'highlight.js/styles/atom-one-dark.css?raw';
import { useParams } from "@solidjs/router";
import {Entries} from "@solid-primitives/keyed";
import {theme} from "@src/App";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import * as pdfjsViewer from "pdfjs-dist/web/pdf_viewer.mjs";
import "pdfjs-dist/web/pdf_viewer.css";
import worker from "pdfjs-dist/build/pdf.worker.mjs?raw";

// var HOSTED_VIEWER_ORIGINS = ['null', 'http://mozilla.github.io', 'https://mozilla.github.io'];

export interface Entry {
	path?: string;
	children?: Book
}

export interface Book {
	[p: string]: Entry
}

const book = await fetch("/book/data.json").then(async res => await res.json() as Book).then(book => {
	const transform = (book: Book, path?: string): Book => Object.fromEntries(Object.entries(book).map(([title, entry]) => {
		if (entry.path) entry.path = path ? path.substring(0, path.lastIndexOf(".")) + "/" + entry.path : entry.path;
		if (entry.children) entry.children = transform(entry.children, entry.path);
		return [title, entry];
	}));

	return transform(book);
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

GlobalWorkerOptions.workerSrc = URL.createObjectURL(new Blob([worker], {type: "application/javascript"}));

const Book: Component = () => {

	let pdfViewer: pdfjsViewer.PDFViewer;

	const eventBus = new pdfjsViewer.EventBus();

	// (Optionally) enable hyperlinks within PDF files.
	const pdfLinkService = new pdfjsViewer.PDFLinkService({
		eventBus,
	});

	// (Optionally) enable find controller.
	const pdfFindController = new pdfjsViewer.PDFFindController({
		eventBus,
		linkService: pdfLinkService,
	});

	async function fetchArticle (index: number) {
		if (!articles[index].path.endsWith(".md")) {
			return null;
		}

		let path = "/book/" + articles[index].path;
		return await fetch(path).then(async res => res.ok
			? res.text()
			: fetch("/book/404.md").then(res => res.text())
		)
	}

	async function fetchPdf (index: number) {
		if (!articles[index].path.endsWith(".pdf")) {
			return null;
		}

		let path = "/book/" + articles[index].path;
		return await getDocument({
			url: path,
			enableHWA: true,
		}).promise;
	}

	const params = useParams();
	let section: HTMLDivElement;
	let pdfContainer: HTMLDivElement;

	const [index, setIndex] = createSignal(0);
	const [article] = createResource(index, fetchArticle);
	const [pdf] = createResource(index, fetchPdf);

	createEffect(() => {
		if (params.chapter) {
			const indexByPath = articles.findIndex(article => article.path === decodeURIComponent(params.chapter));
			if (indexByPath === -1) {
				console.warn("Article " + decodeURIComponent(params.chapter) + " not found.");
				return;
			}
			setIndex(indexByPath);
		}
	});

	createEffect(on(index, () => {
		pdfViewer?.cleanup();
	}));

	createEffect(on([article, theme], ([article]) => {
		hljs.highlightAll();
	}));

	createEffect(on([article, pdf], () => {
		window.scrollTo(0, section.clientHeight - 128);
	}));

	createEffect(on(pdf, pdfDocument => {
		if (!pdfDocument) return;
		pdfViewer.setDocument(pdfDocument);
	}));

	onMount(() => {
		pdfViewer = new pdfjsViewer.PDFViewer({
			container: pdfContainer,
			eventBus,
			linkService: pdfLinkService,
			findController: pdfFindController,
			enableHWA: true,
		});
		pdfLinkService.setViewer(pdfViewer);
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
					{ article.loading ? (
						<p>Loading...</p>
					) : (
						<Show when={theme()} keyed>
							{ theme => <>
								<style>
									{theme === "light" ? light : dark}
								</style>
								<SolidMarkdown children={article()} transformImageUri={(src, alt) => {
									if (theme === "dark" && src.endsWith("?theme=light")) return "/book/blank.png";
									if (theme === "light" && src.endsWith("?theme=dark")) return "/book/blank.png";

									if (src.startsWith("http")) return src;
									// if (src.startsWith("/public")) return "/book" + src;
									const directory = articles[index()].path;
									return "/book/" + directory.substring(0, directory.lastIndexOf("/") + 1) + src;
								}}/>
							</>}
						</Show>
					) }

					<div class="h-[calc(100vh-20rem)] overflow-scroll" classList={{
						"hidden": !pdf()
					}}>
						<div ref={pdfContainer} class="relative inset-0">
							<div id="viewer" class="pdfViewer"></div>
						</div>
					</div>

					{ index() !== undefined && (
						<div class="grid grid-cols-[1fr,1fr] gap-x-6 mt-8">
							{articles[index() - 1] &&
								<Button title={articles[index() - 1].title} article={articles[index() - 1]}
										class="col-start-1"/>}
							{articles[index() + 1] &&
								<Button title={articles[index() + 1].title} article={articles[index() + 1]}
										class="col-start-2"/>}
						</div>
					)}
				</main>
			</article>
		</section>
	</>
}

export default Book;