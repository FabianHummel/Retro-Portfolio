import { useNavigate, useParams } from "@solidjs/router";
import { theme as appTheme, theme } from "@src/App";
import hljs from "highlight.js/lib/core";
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
import { SolidMarkdown } from "solid-markdown";
import "pdfjs-dist/web/pdf_viewer.css";
import { Button } from "@components/book/Button";
import { Entry } from "@components/book/Entry";
import { Breadcrumbs } from "@components/book/Breadcrumbs";
import MarkdownImageComponent from "@components/book/MarkdownImage";
import useLoading from "@components/shared/Loading";
import { Entries } from "@solid-primitives/keyed";
import javascript from 'highlight.js/lib/languages/javascript';
import rust from 'highlight.js/lib/languages/rust';
import typescript from 'highlight.js/lib/languages/typescript';
import cpp from 'highlight.js/lib/languages/cpp';
import c from 'highlight.js/lib/languages/c';
import objectiveC from 'highlight.js/lib/languages/objectivec';
import swift from 'highlight.js/lib/languages/swift';
import darkTheme from "highlight.js/styles/atom-one-dark.min.css";
import lightTheme from "highlight.js/styles/atom-one-light.min.css";
import worker from "pdfjs-dist/build/pdf.worker.mjs?raw";
import { parseQueryString } from "pdfjs-dist/web/pdf_viewer.mjs";
import type { Accessor } from "solid-js";
import { createContext, onCleanup } from "solid-js";
import { createCodeMirror, createEditorControlledValue } from "solid-codemirror";
import { EditorView } from "@codemirror/view";
import { markdown } from "@codemirror/lang-markdown";
import { basicSetup } from "codemirror";
import { gruvboxDark } from "@fsegurai/codemirror-theme-gruvbox-dark";
import { Compartment } from "@codemirror/state";
import { gruvboxLight } from "@fsegurai/codemirror-theme-gruvbox-light";
import useSongplayer from "@components/music/Songplayer";
import { unifiedMergeView } from "@codemirror/merge";
import interact from "interactjs";

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

GlobalWorkerOptions.workerSrc = URL.createObjectURL(
    new Blob([worker], { type: "application/javascript" }),
);

export interface BookContextProps {
    currentArticleIndex: Accessor<number>;
    articles: Accessor<IArticle[]>;
    findNextArticle: (from: number, direction: number) => IArticle;
    closeMobileSidebar: VoidFunction;
    book: Accessor<IBook>;
    isEditing: Accessor<boolean>;
    toggleEditMode: () => void;
    dragEntry: Accessor<Element>;
}

export const BookContext = createContext<BookContextProps>();

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
    const [isEditing, setIsEditing] = createSignal(false);

    const { setIsEditorFocused } = useSongplayer();

    function toggleEditMode() {
        setIsEditing(!isEditing());
    }

    const { startLoading } = useLoading();
    let complete: VoidFunction;

    const navigate = useNavigate();

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

    onMount(() => {
        fetch("/book/data.json").then(async res => {
            complete = startLoading(1.0);
            return await res.json() as Promise<IBook>;
        })
            .then(transformBookEntries)
            .then(onBookLoaded);
    })

    function transformBookEntries(book: IBook, path?: string): IBook {
        return Object.fromEntries(Object.entries(book).map(([entryPath, entry]) => {
            const fullPath = path
                ? `${path.includes('.') ? path.substring(0, path.lastIndexOf(".")) : path}/${entryPath}`
                : entryPath;
            entry.hasContent = fullPath?.includes('.') ?? false;
            if (entry.children) {
                entry.children = transformBookEntries(entry.children, fullPath);
            }
            return [fullPath, entry];
        }));
    }

    function onBookLoaded(book: IBook) {
        complete();
        setBook(book);
    }

    function flattenBook(book: IBook) {
        return Object.entries(book).reduce<IArticle[]>((acc, [path, entry]) => {
            acc.push({
                title: entry.title ?? path,
                path: path,
                hasContent: entry.hasContent
            });
            if (entry.children) {
                acc.push(...flattenBook(entry.children))
            };
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
            const firstArticle = findNextArticle(0, 1);
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

    createEffect(on(currentArticleIndex, () => {
        pdfViewer?.cleanup();
    }));

    createEffect(on([article, appTheme], () => {
        hljs.highlightAll();
    }));

    createEffect(
        on(pdf, (pdfDocument) => {
            if (!pdfDocument) return;
            pdfViewer.setDocument(pdfDocument);
            try {
                // Inform the link service about the loaded document so internal links work
                pdfLinkService.setDocument(pdfDocument, null);
            } catch (e) {
                // ignore if link service isn't ready
            }
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

        // Ensure PDF initially fits the container width once pages are initialized
        eventBus.on?.('pagesinit', () => {
            try {
                pdfViewer.currentScaleValue = 'page-width';
            } catch (_) {
                // ignore if pdfViewer not ready
            }
        });

        // Re-apply page-width on window resize to keep it fitting the container
        const handlePdfResize = () => {
            try {
                pdfViewer.currentScaleValue = 'page-width';
            } catch (_) {
                // ignore
            }
        };
        window.addEventListener('resize', handlePdfResize);

        onCleanup(() => {
            window.removeEventListener('resize', handlePdfResize);
        });
    });

    let scrollContainer!: HTMLDivElement;
    let sidebarContainer!: HTMLDivElement;
    let aside!: HTMLDivElement;

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

    function transformImageUri(src: string): string {
        const searchParamIndex = src.lastIndexOf('?');
        const queryParams = parseQueryString(src.substring(searchParamIndex));
        if (queryParams.get("theme") !== undefined && appTheme() !== queryParams.get("theme")) {
            return "/book/blank.png";
        }

        if (src.startsWith("http")) return src;

        const directory = articles()[currentArticleIndex()].path;
        const path = directory.substring(0, directory.lastIndexOf("/") + 1);
        const source = `/book/${path}${searchParamIndex === -1 ? src : src.substring(0, searchParamIndex)}`;

        setTimeout(() => {
            const img = document.querySelector<HTMLImageElement>(`img[src='${source}'], video[src='${source}']`);
            if (!img) return;
            img.style.height = queryParams.get("height");
            img.style.width = queryParams.get("width");
            img.style.marginLeft = queryParams.get("align") === "left" ? "auto" : "";
            img.style.marginRight = queryParams.get("align") === "right" ? "auto" : "";
            img.style.marginInline = queryParams.get("align") === "center" ? "auto" : "";

            if (queryParams.has("style")) {
                for (const [key, value] of Object.entries(JSON.parse(queryParams.get("style")))) {
                    img.style[key] = value;
                }
            }
        });

        return source;
    }

    const [code, setCode] = createSignal("");

    const { editorView, ref: editorRef, createExtension } = createCodeMirror({
        onValueChange: setCode
    });

    createEditorControlledValue(editorView, code);

    const themeCompartment = new Compartment();
    const mergeCompartment = new Compartment();

    const focusListener = EditorView.updateListener.of((update) => {
        if (update.focusChanged) {
            setIsEditorFocused(update.view.hasFocus);
        }
    });

    createExtension(basicSetup);
    createExtension(EditorView.lineWrapping)
    createExtension(markdown());
    createExtension(themeCompartment.of(theme() === "light" ? gruvboxLight : gruvboxDark));
    createExtension(focusListener)
    createExtension(mergeCompartment.of(unifiedMergeView({
        original: "",
        mergeControls: false,
    })));

    createEffect(on([article], ([article]) => {
        setCode(article);

        editorView()?.dispatch({
            effects: mergeCompartment.reconfigure(
                unifiedMergeView({
                    original: article,
                    mergeControls: false,
                }),
            ),
        });
    }));

    createEffect(on(theme, theme => {
        editorView()?.dispatch({
            effects: themeCompartment.reconfigure(theme === "light" ? gruvboxLight : gruvboxDark)
        });
    }));

    const [dragEntry, setDragEntry] = createSignal<HTMLElement>(null);
    const [dropZoneTarget, setDropZoneTarget] = createSignal<HTMLElement>(null);

    interact(".book-entry")
        .draggable({
            manualStart: true,
            lockAxis: "y",
            onstart: (event: Interact.DragEvent) => {
                event.currentTarget.classList.add("drag");
                setDragEntry(event.currentTarget as HTMLElement);
            },
            onend: (event: Interact.DragEvent) => {
                event.currentTarget.classList.remove("drag");
                if (dragEntry() && dropZoneTarget()) {
                    handleDropEntry();
                }
                setDragEntry(null);
                setDropZoneTarget(null);
            },
            onmove: (event: Interact.DragEvent) => {
                const element = document.elementFromPoint(event.clientX, event.clientY);
                if (!element.classList.contains("drop-zone")) return;
                setDropZoneTarget(element as HTMLElement);
            }
        })
        .on('hold', (event) => {
            var interaction = event.interaction;

            if (!interaction.interacting() && isEditing()) {
                interaction.start(
                    { name: "drag" },
                    event.interactable,
                    event.currentTarget,
                );
            }
        });

    createEffect(on(dropZoneTarget, (target, previous) => {
        previous?.classList?.remove("active");
        target?.classList?.add("active");
    }));

    function traverseAndGetContainingEntryBook(path: string, deleteIfLastChild?: boolean): [IBook, string, string] {
        let containingEntryBook = book();
        let searchPath = null;
        const paths = path.split("/");
        const name = paths.pop();
        for (const dir of paths) {
            searchPath = searchPath === null ? dir : `${searchPath}/${dir}`;
            containingEntryBook = Object.entries(containingEntryBook).find(([path]) => path.startsWith(searchPath))[1].children;
        }
        if (deleteIfLastChild) {
            const [parent, previousSearchPath, name] = traverseAndGetContainingEntryBook(searchPath);
            const entry = Object.entries(parent).find(([path]) => path.startsWith(`${previousSearchPath}/${name}`))[1];
            if (Object.entries(entry.children).length <= 1) {
                entry.children = undefined;
            }
        }
        return [containingEntryBook, searchPath, name];
    }

    function handleDropEntry() {
        const fromEntryPath = dragEntry().dataset.path;
        const toEntryPath = dropZoneTarget().parentElement.dataset.path;

        console.log(`Moving ${fromEntryPath} → ${toEntryPath}`);

        // Remove "from" entry
        let [containingEntryBook, searchPath, name] = traverseAndGetContainingEntryBook(fromEntryPath, true);
        const fromEntry = containingEntryBook[`${searchPath}/${name}`];
        delete containingEntryBook[`${searchPath}/${name}`];
        const fromName = name;

        // Insert next or inside "to" entry
        [containingEntryBook, searchPath, name] = traverseAndGetContainingEntryBook(toEntryPath);
        const toEntries = Object.entries(containingEntryBook);
        const insertIndex = toEntries.findIndex(([path]) => path === `${searchPath}/${name}`)

        if (dropZoneTarget().classList.contains("drop-zone-above")) {
            toEntries.splice(insertIndex, 0, [`${searchPath}/${fromName}`, fromEntry]);
            [containingEntryBook, searchPath, name] = traverseAndGetContainingEntryBook(searchPath);
            containingEntryBook[`${searchPath}/${name}`].children = Object.fromEntries(toEntries);
        }
        else if (dropZoneTarget().classList.contains("drop-zone-inside")) {
            containingEntryBook[`${searchPath}/${name}`].children ??= {}
            const newDirName = name.includes(".") ? name.substring(0, name.lastIndexOf(".")) : name;
            containingEntryBook[`${searchPath}/${name}`].children[`${searchPath}/${newDirName}/${fromName}`] = fromEntry;
        }
        else if (dropZoneTarget().classList.contains("drop-zone-below")) {
            toEntries.splice(insertIndex + 1, 0, [`${searchPath}/${fromName}`, fromEntry]);
            [containingEntryBook, searchPath, name] = traverseAndGetContainingEntryBook(searchPath);
            containingEntryBook[`${searchPath}/${name}`].children = Object.fromEntries(toEntries);
        }

        setBook(JSON.parse(JSON.stringify(book())));
    }

    return <BookContext.Provider value={{
        currentArticleIndex,
        articles,
        findNextArticle,
        closeMobileSidebar,
        book,
        isEditing,
        toggleEditMode,
        dragEntry
    }}>
        {/* hide footer */}
        <style>{`footer { display: none !important; }`}</style>

        <style>{appTheme() === "dark" ? darkTheme : lightTheme}</style>

        <section ref={scrollContainer} class="h-[100dvh] pt-[var(--navbar-height)] py-10 max-lg:pb-4 lg:px-6 grid grid-cols-[22rem,calc(100vw-3px)] lg:grid-cols-[25rem,auto] gap-1 lg:gap-x-8 overflow-auto max-lg:snap-x snap-mandatory">
            <div ref={sidebarContainer} class="border-r-gray border-r-2 snap-start font-main">
                <aside ref={aside} class="sticky top-0 self-start max-lg:px-5 lg:pr-8">
                    <Entries of={book()}>
                        {(path, entry) => <Entry
                            title={entry().title ?? path}
                            path={path}
                            entry={entry()}
                            class="!ml-0" />}
                    </Entries>
                </aside>
            </div>

            <main
                class="w-full max-w-[800px] max-lg:px-6 mx-auto snap-start"
                style={`opacity: ${articleOpacity()};`}
            >
                <Breadcrumbs />
                <Show when={!isEditing()}>
                    <article>
                        {article.loading ? (
                            <p>Loading...</p>
                        ) : (
                            <SolidMarkdown children={code()} transformImageUri={transformImageUri} components={{
                                img: MarkdownImageComponent
                            }} />
                        )}

                        <div
                            class="h-[calc(100vh-20rem)] overflow-scroll"
                            classList={{ hidden: !pdf() }}
                        >
                            <div ref={pdfContainer} class="relative inset-0">
                                <div id="viewer" class="pdfViewer"></div>
                            </div>
                        </div>

                        <Show when={currentArticleIndex() !== -1}>
                            <div class="grid grid-cols-[1fr,1fr] gap-x-6 mt-8">
                                <Button article={findNextArticle(currentArticleIndex(), -1)} class="col-start-1" />
                                <Button article={findNextArticle(currentArticleIndex(), 1)} class="col-start-2" />
                            </div>
                        </Show>
                    </article>
                </Show>

                <div ref={editorRef} style={`margin-inline: ${isEditing() ? "-1.5rem" : null}; display: ${isEditing() ? "block" : "none"}`} />
            </main>
        </section>
    </BookContext.Provider>;
};

export default Book;
