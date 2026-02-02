import { useParams } from "@solidjs/router";
import { theme } from "@src/App";
import hljs from "highlight.js";
import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";
import * as pdfjsViewer from "pdfjs-dist/web/pdf_viewer.mjs";
import {
    type Component,
    createEffect,
    createResource,
    createSignal,
    on,
    onMount,
    Show
} from "solid-js";
import SolidMarkdown from "solid-markdown";
import "pdfjs-dist/web/pdf_viewer.css";
import { Button } from "@components/book/Button";
import { Entry } from "@components/book/Entry";
import useLoading from "@components/shared/Loading";
import createLocalStorageSignal from "@components/shared/LocalStorageSignal";
import { PixelImage } from "@components/shared/PixelImage";
import { Entries } from "@solid-primitives/keyed";
import worker from "pdfjs-dist/build/pdf.worker.mjs?raw";

export interface IEntry {
    path?: string;
    children?: IBook;
}

export interface IBook {
    [p: string]: IEntry;
}

export interface IArticle {
    title: string,
    path: string,
}

GlobalWorkerOptions.workerSrc = URL.createObjectURL(
    new Blob([worker], { type: "application/javascript" }),
);

export const [openedArticleIndex, setOpenedArticleIndex] = createSignal(0);

export const [articles, setArticles] = createSignal<IArticle[]>([]);

const Book: Component = () => {
    const { startLoading } = useLoading();
    let complete: VoidFunction;

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

    const [book, setBook] = createSignal<IBook>(null);

    fetch("/book/data.json")
        .then(async res => {
            complete = startLoading(1.0);
            return await res.json() as Promise<IBook>;
        })
        .then(function transform(book: IBook, path?: string): IBook {
            return Object.fromEntries(Object.entries(book).map(([title, entry]) => {
                entry.path = path
                    ? `${path.substring(0, path.lastIndexOf("."))}/${entry.path}`
                    : entry.path;
                if (entry.children) {
                    entry.children = transform(entry.children, entry.path);
                }
                return [title, entry];
            }));
        })
        .then(book => {
            complete();
            setArticles(flattenBook(book));
            setBook(book);
        });

    function flattenBook(book: IBook) {
        return Object.entries(book).reduce((acc, [title, entry]) => {
            acc.push({ title, path: entry.path });
            if (entry.children) {
                acc.push(...flattenBook(entry.children))
            };
            return acc;
        }, []);
    }

    const [bookFontSize, setBookFontSize] = createLocalStorageSignal(
        "book:font-size",
        1,
    );
    const [smoothBookFont, setSmoothBookFont] = createLocalStorageSignal(
        "book:smooth-font",
        true,
    );

    async function fetchArticle(index: number) {
        if (!articles()[index]?.path?.endsWith(".md")) {
            return null;
        }

        const path = `/book/${articles()[index].path}`;
        return await fetch(path).then(async (res) =>
            res.ok ? res.text() : fetch("/book/404.md").then((res) => res.text()),
        );
    }

    async function fetchPdf(index: number) {
        if (!articles()[index]?.path?.endsWith(".pdf")) {
            return null;
        }

        const path = `/book/${articles()[index].path}`;
        return await getDocument({
            url: path,
            enableHWA: true,
        }).promise;
    }

    const params = useParams();
    let pdfContainer: HTMLDivElement;

    const [article] = createResource(openedArticleIndex, fetchArticle);
    const [pdf] = createResource(openedArticleIndex, fetchPdf);

    createEffect(() => {
        if (!params.chapter) {
            return;
        }

        const indexByPath = articles().findIndex(article =>
            article.path === decodeURIComponent(params.chapter));

        if (indexByPath > 0) {
            setOpenedArticleIndex(indexByPath);
            return;
        }

        console.warn(`Article ${decodeURIComponent(params.chapter)} not found.`);
    });

    createEffect(on(openedArticleIndex, () => {
        pdfViewer?.cleanup();
    }));

    createEffect(on([article, theme], () => {
        hljs.highlightAll();
    }));

    createEffect(
        on(pdf, (pdfDocument) => {
            if (!pdfDocument) return;
            pdfViewer.setDocument(pdfDocument);
        }),
    );

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
        {/* hide footer */}
        <style>{`footer { display: none !important; }`}</style>

        {/* article font size */}
        <style>{`.article-content { font-size: ${bookFontSize()}em; }`}</style>

        <section class="pt-[var(--navbar-height)] h-screen py-10 px-6 grid lg:grid-cols-[25rem,auto] gap-x-8 overflow-auto">
            <div class="border-r-gray lg:border-r-2">
                <aside class="sticky top-0 self-start pr-8 hidden lg:block">
                    <div class="flex flex-row pt-4 gap-2">
                        <button type="button" class="cursor-pointer" onClick={() => setSmoothBookFont(!smoothBookFont())}>
                            {smoothBookFont() ? (
                                <PixelImage alt="Enable pixelated font" src={"/img/book/Pixel Font.png"} darkSrc={"/img/book/Pixel Font Dark.png"} w={6} h={5} scale={5} />
                            ) : (
                                <img alt="Enable smooth font" src={theme() === "light" ? "/img/book/Smooth Font.svg" : "/img/book/Smooth Font Dark.svg"} width={25} height={25} />
                            )}
                        </button>

                        <PixelImage
                            class="cursor-pointer"
                            onClick={() => setBookFontSize(Math.min(bookFontSize() + 0.1, 2))}
                            src={"/img/book/Font Size Bigger.png"}
                            darkSrc={"/img/book/Font Size Bigger Dark.png"}
                            w={5} h={5} scale={5} />

                        <PixelImage
                            class="cursor-pointer"
                            onClick={() => setBookFontSize(Math.max(bookFontSize() - 0.1, 0.5))}
                            src={"/img/book/Font Size Smaller.png"}
                            darkSrc={"/img/book/Font Size Smaller Dark.png"}
                            w={5} h={5} scale={5} />
                    </div>

                    <Entries of={book()}>
                        {(title, entry) => <Entry title={title} entry={entry()} index={openedArticleIndex()} />}
                    </Entries>
                </aside>
            </div>

            <article>
                <main class="max-w-[800px] mx-auto">
                    {article.loading ? (
                        <p>Loading...</p>
                    ) : (
                        <Show when={theme()} keyed>
                            {(theme) => <SolidMarkdown
                                class={`article-content ${smoothBookFont() ? "smooth-font" : ""}`}
                                children={article()}
                                transformImageUri={(src) => {
                                    if (theme === "dark" && src.endsWith("?theme=light"))
                                        return "/book/blank.png";
                                    if (theme === "light" && src.endsWith("?theme=dark"))
                                        return "/book/blank.png";

                                    if (src.startsWith("http")) return src;
                                    // if (src.startsWith("/public")) return "/book" + src;
                                    const directory = articles()[openedArticleIndex()].path;
                                    const path = directory.substring(
                                        0,
                                        directory.lastIndexOf("/") + 1,
                                    );
                                    return `/book/${path}${src}`;
                                }}
                            />}
                        </Show>
                    )}

                    <div
                        class="h-[calc(100vh-20rem)] overflow-scroll"
                        classList={{
                            hidden: !pdf(),
                        }}
                    >
                        <div ref={pdfContainer} class="relative inset-0">
                            <div id="viewer" class="pdfViewer"></div>
                        </div>
                    </div>

                    {openedArticleIndex() !== undefined && (
                        <div class="grid grid-cols-[1fr,1fr] gap-x-6 mt-8">
                            {articles()[openedArticleIndex() - 1] && (
                                <Button article={articles()[openedArticleIndex() - 1]} class="col-start-1" />
                            )}
                            {articles()[openedArticleIndex() + 1] && (
                                <Button article={articles()[openedArticleIndex() + 1]} class="col-start-2" />
                            )}
                        </div>
                    )}
                </main>
            </article>
        </section>
    </>;
};

export default Book;
