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
import type { Accessor, Setter } from "solid-js";
import { createContext } from "solid-js";
import { onCleanup } from "solid-js";

export interface IEntry {
    path?: string;
    children?: IBook;
    hasContent: boolean;
    isDownloadable: boolean;
}

export interface IBook {
    [p: string]: IEntry;
}

export interface IArticle {
    title: string;
    path: string;
    hasContent: boolean;
}

GlobalWorkerOptions.workerSrc = URL.createObjectURL(
    new Blob([worker], { type: "application/javascript" }),
);

export interface BookContextProps {
    currentArticleIndex: Accessor<number>;
    setCurrentArticleIndex: Setter<number>;
    articles: Accessor<IArticle[]>;
    findArticleSequentially: (direction: number) => IArticle;
    closeMobileSidebar: VoidFunction;
}

export const BookContext = createContext<BookContextProps>();

const Book: Component = () => {
    const [currentArticleIndex, setCurrentArticleIndex] = createSignal(0);

    const [articles, setArticles] = createSignal<IArticle[]>([]);

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
                entry.hasContent = entry.path?.includes('.') ?? false;
                entry.path = path
                    ? `${path.includes('.') ? path.substring(0, path.lastIndexOf(".")) : path}/${entry.path}`
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
        return Object.entries(book).reduce<IArticle[]>((acc, [title, entry]) => {
            acc.push({
                title,
                path: entry.path,
                hasContent: entry.hasContent
            });
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

    const [article] = createResource(currentArticleIndex, fetchArticle);
    const [pdf] = createResource(currentArticleIndex, fetchPdf);

    createEffect(() => {
        if (articles().length > 0 && !params.chapter) {
            setCurrentArticleIndex(1);
        }

        const indexByPath = articles().findIndex(article =>
            article.path === decodeURIComponent(params.chapter));

        if (indexByPath > 0) {
            setCurrentArticleIndex(indexByPath);
            return;
        }

        console.warn(`Article ${decodeURIComponent(params.chapter)} not found.`);
    });

    createEffect(on(currentArticleIndex, () => {
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

    function findArticleSequentially(direction: number) {
        let i = currentArticleIndex();
        while (true) {
            i += direction;
            if (i < 0 || i > articles().length) {
                return undefined;
            }
            const article = articles()[i];
            if (article.hasContent) {
                return article;
            }
        }
    }

    let scrollContainer!: HTMLDivElement;
    let sidebarContainer!: HTMLDivElement;

    onMount(() => {
        scrollContainer.scrollLeft = sidebarContainer.clientWidth;

        scrollContainer.addEventListener("scroll", handleNavigationScroll);
    });

    onCleanup(() => {
        scrollContainer.removeEventListener("scroll", handleNavigationScroll);
    });

    const [articleOpacity, setArticleOpacity] = createSignal(1.0);

    function handleNavigationScroll() {
        if (scrollContainer.scrollWidth > scrollContainer.clientWidth) {
            setArticleOpacity(scrollContainer.scrollLeft / sidebarContainer.clientWidth / 2.0 + 0.5);
            const mobileSidebarVisible = scrollContainer.scrollLeft < sidebarContainer.clientWidth / 2.0;
            scrollContainer.classList.toggle("mobile-sidebar-visible", mobileSidebarVisible);
        }
        else {
            setArticleOpacity(1.0);
            scrollContainer.classList.remove("mobile-sidebar-visible");
        }
    }

    function closeMobileSidebar() {
        scrollContainer.scrollTo({
            behavior: "smooth",
            top: 0,
            left: sidebarContainer.clientWidth
        });
    }

    return <BookContext.Provider value={{
        currentArticleIndex,
        setCurrentArticleIndex,
        articles,
        findArticleSequentially,
        closeMobileSidebar
    }}>
        {/* hide footer */}
        <style>{`footer { display: none !important; }`}</style>

        {/* article font size */}
        <style>{`.article-content { font-size: ${bookFontSize()}em; }`}</style>

        <section ref={scrollContainer} class="h-screen pt-[var(--navbar-height)] py-10 max-lg:pb-4 lg:px-6 grid grid-cols-[22rem,100vw] lg:grid-cols-[25rem,auto] gap-1 lg:gap-x-8 overflow-auto snap-x snap-mandatory">
            <div ref={sidebarContainer} class="border-r-gray border-r-2 max-lg:px-3 snap-start">
                <aside class="sticky top-0 self-start max-lg:pr-3 lg:pr-8">
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
                        {(title, entry) => <Entry
                            title={title}
                            entry={entry()}
                            index={currentArticleIndex()}
                            class="!ml-0" />}
                    </Entries>
                </aside>
            </div>

            <article class="max-lg:px-6 snap-start" style={`opacity: ${articleOpacity()};`}>
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
                                    const directory = articles()[currentArticleIndex()].path;
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

                    {currentArticleIndex() !== undefined && (
                        <div class="grid grid-cols-[1fr,1fr] gap-x-6 mt-8">
                            <Button article={findArticleSequentially(-1)} class="col-start-1" />
                            <Button article={findArticleSequentially(1)} class="col-start-2" />
                        </div>
                    )}
                </main>
            </article>
        </section>
    </BookContext.Provider>;
};

export default Book;
