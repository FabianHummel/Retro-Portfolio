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
import {PixelImage} from "@components/shared/PixelImage";
import Sidebar from "@components/book/Sidebar";
import createLocalStorageSignal from "@components/shared/LocalStorageSignal";
import {debug} from "node:util";

// var HOSTED_VIEWER_ORIGINS = ['null', 'http://mozilla.github.io', 'https://mozilla.github.io'];

export interface Entry {
	path?: string;
	children?: Book
}

export interface Book {
	[p: string]: Entry
}

export const book = await fetch("/book/data.json").then(async res => await res.json() as Book).then(book => {
	const transform = (book: Book, path?: string): Book => Object.fromEntries(Object.entries(book).map(([title, entry]) => {
		if (entry.path) entry.path = path ? path.substring(0, path.lastIndexOf(".")) + "/" + entry.path : entry.path;
		if (entry.children) entry.children = transform(entry.children, entry.path);
		return [title, entry];
	}));

	return transform(book);
});

export const articles = (function flatten(book: Book) {
	return Object.entries(book).reduce((acc, [title, entry]) => {
		if (entry.path) acc.push({
			title: title,
			path: entry.path
		});
		if (entry.children) acc.push(...flatten(entry.children));
		return acc;
	}, []);
})(book);

export const [openedArticleIndex, setOpenedArticleIndex] = createSignal(0);

export const [bookFontSize, setBookFontSize] = createLocalStorageSignal("book:font-size", 1);
export const [smoothBookFont, setSmoothBookFont] = createLocalStorageSignal("book:smooth-font", true);

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

	const [article] = createResource(openedArticleIndex, fetchArticle);
	const [pdf] = createResource(openedArticleIndex, fetchPdf);
	const [mobileSidebarVisible, setMobileSidebarVisible] = createSignal(false);

	createEffect(() => {
		if (params.chapter) {
			const indexByPath = articles.findIndex(article => article.path === decodeURIComponent(params.chapter));
			if (indexByPath === -1) {
				console.warn("Article " + decodeURIComponent(params.chapter) + " not found.");
				return;
			}
			setOpenedArticleIndex(indexByPath);
		}
	});

	createEffect(on(openedArticleIndex, () => {
		pdfViewer?.cleanup();
	}));

	createEffect(on([article, theme], () => {
		hljs.highlightAll();
	}));

	createEffect(on([article, pdf], () => {
		window.scrollTo(0, section.clientHeight - 128);
		setMobileSidebarVisible(false);
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

		<section class="relative py-10 pl-6 pr-6 lg:pr-24 grid lg:grid-cols-[25rem,auto] gap-x-8">
			<div class="fixed top-[var(--navbar-height)] lg:hidden m-4" onClick={() => setMobileSidebarVisible(true)}>
				<PixelImage src={"/img/book/Menu.png"} darkSrc={"/img/book/Menu Dark.png"} w={12} h={12} scale={5}/>
			</div>
			<Show when={mobileSidebarVisible()} fallback={
				<div class="border-r-gray lg:border-r-2">
					<Sidebar class="sticky top-36 self-start pr-8 hidden lg:block" />
				</div>
			}>
				<div class="fixed top-[var(--navbar-height)] lg:hidden w-full h-[calc(100%-var(--navbar-height))] bg-white dark:bg-dark z-10 overflow-scroll no-body-scroll">
					<Sidebar class="w-full h-full pr-2" />
				</div>

				<div class="fixed top-[var(--navbar-height)] lg:hidden m-4 z-20"
					 onClick={() => setMobileSidebarVisible(false)}>
					<PixelImage src={"/img/book/Close.png"} darkSrc={"/img/book/Close Dark.png"} w={5} h={5} scale={5}/>
				</div>
			</Show>
			<article class="overflow-auto">
				<main class="max-w-[1000px] mx-auto">
					{article.loading ? (
						<p>Loading...</p>
					) : (
						<Show when={theme()} keyed>
							{theme => <>
								<style>
									{(theme === "light" ? light : dark) + `\n
									.article-content {
										font-size: ${bookFontSize()}em;
									}
									`}
								</style>
								<SolidMarkdown
									class={"article-content " + (smoothBookFont() ? "smooth-font" : "")}
									children={article()}
									transformImageUri={(src, alt) => {
										if (theme === "dark" && src.endsWith("?theme=light")) return "/book/blank.png";
										if (theme === "light" && src.endsWith("?theme=dark")) return "/book/blank.png";

										if (src.startsWith("http")) return src;
										// if (src.startsWith("/public")) return "/book" + src;
										const directory = articles[openedArticleIndex()].path;
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

					{ openedArticleIndex() !== undefined && (
						<div class="grid grid-cols-[1fr,1fr] gap-x-6 mt-8">
							{articles[openedArticleIndex() - 1] &&
								<Button title={articles[openedArticleIndex() - 1].title} article={articles[openedArticleIndex() - 1]}
										class="col-start-1"/>}
							{articles[openedArticleIndex() + 1] &&
								<Button title={articles[openedArticleIndex() + 1].title} article={articles[openedArticleIndex() + 1]}
										class="col-start-2"/>}
						</div>
					)}
				</main>
			</article>
		</section>
	</>
}

export default Book;