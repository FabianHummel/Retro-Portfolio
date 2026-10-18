import { useNavigate, useParams } from "@solidjs/router";
import { theme as appTheme } from "@src/App";
import hljs from "highlight.js/lib/core";
import {
    type Component,
    createEffect,
    createResource,
    createSignal,
    on,
    onMount,
    Show,
    createMemo
} from "solid-js";
import { SolidMarkdown } from "solid-markdown";
import { Button } from "@components/book/Button";
import { Entry } from "@components/book/Entry";
import { Breadcrumbs } from "@components/book/Breadcrumbs";
import MarkdownImageComponent from "@components/book/MarkdownImage";
import WelcomePage from "@components/book/WelcomePage";
import useLoading from "@components/shared/Loading";
import { Entries } from "@solid-primitives/keyed";
import javascript from 'highlight.js/lib/languages/javascript';
import rust from 'highlight.js/lib/languages/rust';
import typescript from 'highlight.js/lib/languages/typescript';
import cpp from 'highlight.js/lib/languages/cpp';
import c from 'highlight.js/lib/languages/c';
import objectiveC from 'highlight.js/lib/languages/objectivec';
import swift from 'highlight.js/lib/languages/swift';
import darkTheme from "highlight.js/styles/atom-one-dark.min.css?inline";
import lightTheme from "highlight.js/styles/atom-one-light.min.css?inline";
import type { Accessor } from "solid-js";
import { createContext, onCleanup } from "solid-js";
import bookStyle from "@components/book/style.css?raw";
import { remarkArticleLink } from "@components/book/remark-article-link"
import { ArticleLink } from "@components/book/ArticleLink";
import MarkdownIFrame from "@components/book/MarkdownIFrame";
import { remarkHtmlIframe } from "@components/book/remark-iframe";

export interface IEntry {
    title?: string;
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

export interface BookContextProps {
    currentArticleIndex: Accessor<number>;
    articles: Accessor<IArticle[]>;
    findNextArticle: (from: number, direction: number) => IArticle;
    book: Accessor<IBook>;
    collapseListeners: Set<VoidFunction>;
    currentArticle: Accessor<IArticle>;
}

export const BookContext = createContext<BookContextProps>();

export function toPath(path: string) {
    return path.split('/').map(s => s.includes('.') ? s.substring(0, s.lastIndexOf('.')) : s).join('/');
}

export function applyClasses(element: HTMLElement, queryParams: URLSearchParams) {
    if (queryParams.get("align")) element.classList.add("align")
    if (queryParams.get("align") === "left") element.classList.add("left")
    if (queryParams.get("align") === "right") element.classList.add("right")
    if (queryParams.get("align") === "center") element.classList.add("center")
    element.style.borderStyle = queryParams.get("border") !== undefined ? "solid" : undefined;

    if (queryParams.has("style")) {
        for (const [key, value] of Object.entries(JSON.parse(queryParams.get("style")))) {
            element.style[key] = value;
        }
    }

    if (queryParams.has("gif") && element instanceof HTMLVideoElement) {
        element.autoplay = true;
        element.muted = true;
        element.loop = true;
        element.playsInline = true;
        element.controls = false;
    }

    if (queryParams.get("size") === "half") element.classList.add("half");
}

const Book: Component = () => {
    hljs.registerLanguage("javascript", javascript);
    hljs.registerLanguage("rust", rust);
    hljs.registerLanguage("typescript", typescript);
    hljs.registerLanguage("cpp", cpp);
    hljs.registerLanguage("c", c);
    hljs.registerLanguage("objectivec", objectiveC);
    hljs.registerLanguage("swift", swift);

    const [currentArticleIndex, setCurrentArticleIndex] = createSignal(-1);
    const [articles, setArticles] = createSignal<IArticle[]>([]);

    const currentArticle = createMemo(() => articles()[currentArticleIndex()]);

    const { startLoading } = useLoading();
    let complete: VoidFunction;

    const navigate = useNavigate();

    const [book, setBook] = createSignal<IBook>(null);

    function transformBookData(data: IBook) {
        for (const [path, entry] of Object.entries(data)) {
            entry.hasContent = path.includes('.');
            if (entry.children) {
                transformBookData(entry.children);
            }
        }
    }

    onMount(async () => {
        const data = await fetch("/book/data.json").then(async res => {
            complete = startLoading(1.0);
            return await res.json() as Promise<IBook>;
        });

        transformBookData(data);

        complete();
        setBook(data);
    });

    function flattenBook(book: IBook, parentPath: string = ""): IArticle[] {
        return Object.entries(book).reduce<IArticle[]>((acc, [key, entry]) => {
            // Concatenate the parent path with the current key
            let currentPath = parentPath ? `${parentPath}/${key}` : key;

            acc.push({
                title: entry.title ?? key,
                path: currentPath,
                hasContent: entry.hasContent
            });

            currentPath = currentPath.includes('.') ? currentPath.substring(0, currentPath.lastIndexOf('.')) : currentPath;

            // Pass the current path down to the children
            if (entry.children) {
                acc.push(...flattenBook(entry.children, currentPath));
            }

            return acc;
        }, []);
    }

    createEffect(on(book, book => {
        if (!book) return;
        setArticles(flattenBook(book));
    }));

    function findNextArticleIndex(i: number, direction: number) {
        while (true) {
            i += direction;
            if (i < 0 || i >= articles().length) {
                return undefined;
            }
            const article = articles()[i];
            if (article.hasContent) {
                return i;
            }
        }
    }

    function findNextArticle(i: number, direction: number) {
        const index = findNextArticleIndex(i, direction);
        return index === undefined ? undefined : articles()[index];
    }

    async function fetchArticle(index: number) {
        if (index !== -1 && !articles()[index]?.path?.endsWith(".md")) {
            return null;
        }

        const path = index !== -1 ? `/book/${articles()[index].path}` : "/book/404.md";
        return fetch(path).then(res => res.text());
    }

    async function fetchPdf(index: number) {
        if (!articles()[index]?.path?.endsWith(".pdf")) {
            return null;
        }

        return `/book/${articles()[index].path}#toolbar=0&navpanes=0`;
    }

    const params = useParams();

    const [article] = createResource(currentArticleIndex, fetchArticle);
    const [pdf] = createResource(currentArticleIndex, fetchPdf);

    createEffect(() => {
        if (articles().length > 0 && !params.chapter) {
            const firstArticle = findNextArticle(-1, 1);
            navigate(firstArticle.path);
            return;
        }

        const indexByPath = articles().findIndex(article =>
            article.path === decodeURIComponent(params.chapter));

        if (indexByPath === -1) {
            console.warn(`Article ${decodeURIComponent(params.chapter)} not found.`);
            return;
        }

        setCurrentArticleIndex(findNextArticleIndex(indexByPath - 1, 1));
    });

    createEffect(on([article, appTheme], () => {
        hljs.highlightAll();
    }));

    let scrollContainer!: HTMLDivElement;
    let articleContainer!: HTMLDivElement;
    let sidebarContainer!: HTMLDivElement;
    let breadcrumbsRef!: HTMLDivElement;
    let articleRef!: HTMLDivElement;

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

    function transformImageUri(src: string): string {
        if (src.startsWith("http")) return src;

        const searchParamIndex = src.lastIndexOf('?');
        const queryParams = new URLSearchParams(src.substring(searchParamIndex));
        if (queryParams.get("theme") !== undefined && appTheme() !== queryParams.get("theme")) {
            return "null";
        }

        const directory = articles()[currentArticleIndex()].path;
        const path = directory.substring(0, directory.lastIndexOf("/") + 1);
        const source = `/book/${path}${searchParamIndex === -1 ? src : src.substring(0, searchParamIndex)}`;

        setTimeout(() => {
            const img = document.querySelector<HTMLElement>(`img[src='${source}'], video[src='${source}'], .iframe-container`);
            if (!img) return;
            img.style.height = queryParams.get("height");
            img.style.width = queryParams.get("width");
            applyClasses(img, queryParams);
        });

        return source;
    }

    createEffect(on(currentArticleIndex, () => {
        const scrollOffset = breadcrumbsRef ? breadcrumbsRef.getBoundingClientRect().height : 0;
        setTimeout(() => {
            scrollContainer.scrollTo({
                left: sidebarContainer.clientWidth,
                behavior: "smooth"
            });

            articleContainer.scrollTo({
                top: scrollOffset,
                behavior: "smooth"
            });
        });
    }));

    return <BookContext.Provider value={{
        currentArticleIndex,
        articles,
        findNextArticle,
        book,
        collapseListeners: new Set(),
        currentArticle
    }}>
        {/* hide footer */}
        <style>{bookStyle}</style>

        <style>{appTheme() === "dark" ? darkTheme : lightTheme}</style>

        <section
            id="book-scroll-container"
            ref={scrollContainer}
            class="h-full lg:pl-6 grid grid-cols-[22rem_calc(100vw-3px)] lg:grid-cols-[25rem_minmax(0px,1200px)] max-lg:snap-x snap-mandatory overflow-auto items-start"
        >
            <aside
                ref={sidebarContainer}
                class="relative h-full pt-6 pb-10 max-lg:pb-4 mr-1 border-r-light dark:border-r-black border-r-2 snap-start font-main self-start max-lg:px-5 lg:pr-8 overflow-auto"
            >
                <Entries of={book()}>
                    {(path, entry) => <Entry
                        path={path}
                        entry={entry()}
                        class="ml-0!" />}
                </Entries>
            </aside>

            <Show when={pdf()}>
                <embed
                    src={pdf()}
                    type="application/pdf"
                    class="w-full h-full snap-start"
                />
            </Show>

            <Show when={!pdf()}>
                <main ref={articleContainer}
                    class="flex flex-col w-full h-full pb-10 pt-5 max-lg:pb-4 mx-auto snap-start px-4 sm:px-12 xl:px-20 overflow-auto"
                    style={`opacity: ${articleOpacity()};`}
                >
                    <Breadcrumbs ref={breadcrumbsRef} />

                    <Show when={currentArticleIndex() !== 0} fallback={
                        <WelcomePage />
                    }>
                        <article ref={articleRef} class="flex-1">
                            <Show when={!article.loading} fallback={
                                <p>Loading...</p>
                            }>
                                <SolidMarkdown
                                    class="article-renderer"
                                    children={article()}
                                    transformImageUri={transformImageUri}
                                    remarkPlugins={[
                                        remarkArticleLink,
                                        remarkHtmlIframe,
                                    ]}
                                    components={{
                                        img: MarkdownImageComponent,
                                        // @ts-ignore ArticleLink does not exist in type Components
                                        ArticleLink: ArticleLink,
                                        // @ts-ignore MarkdownIFrame does not exist in type Components
                                        MarkdownIFrame: MarkdownIFrame,
                                    }}
                                />
                            </Show>

                            <Show when={currentArticleIndex() !== -1}>
                                <div class="flex gap-6 mt-8">
                                    <Button direction={-1} class="flex-1 max-w-[50%]" />
                                    <Button direction={1} class="flex-1 max-w-[50%] mx-auto" />
                                </div>
                            </Show>

                        </article>
                    </Show>
                </main>
            </Show>
        </section>
    </BookContext.Provider>;
};

export default Book;
