import { PixelImage } from "@components/shared/PixelImage";
import { BookContext, type IEntry } from "@pages/Book";
import { Entries } from "@solid-primitives/keyed";
import { A } from "@solidjs/router";
import { clsx } from "clsx";
import { type Component, createEffect, createSignal, type JSX, onMount, Show, splitProps, useContext, on, createMemo } from "solid-js";

export interface EntryProps extends JSX.HTMLAttributes<HTMLDivElement> {
    path: string;
    entry: IEntry;
    parent?: string;
    dataParent?: string;
}

export const Entry: Component<EntryProps> = (props) => {
    const [local, other] = splitProps(props, ["path", "entry", "parent", "dataParent"])
    const [open, setOpen] = createSignal(false);

    const absoluteParent = local.parent ? local.parent.includes('.') ? local.parent.substring(0, local.parent.lastIndexOf('.')) : local.parent : null
    const absolutePath = absoluteParent ? `${absoluteParent}/${local.path}` : local.path;
    const dataPath = local.dataParent ? `${local.dataParent}/${local.path}` : local.path;
    const title = local.entry.title ?? local.path;

    const { currentArticleIndex, articles, findNextArticle, dragEntry, articleChanges } = useContext(BookContext);

    let entryRef!: HTMLDivElement;

    onMount(() => {
        setOpen(window.localStorage.getItem(`book:${local.path}`) === "true");

        entryRef.addEventListener("openEntry", () => {
            setOpen(true);
        });
    });

    createEffect(() => {
        window.localStorage.setItem(`book:${local.path}`, open() ? "true" : "false");
    });

    createEffect(on(currentArticleIndex, (currentArticleIndex) => {
        if (articles()[currentArticleIndex]?.path.startsWith(local.path)) {
            setOpen(true);
        }
    }));

    const articleIndex = createMemo(() => {
        return articles().findIndex(a => a.path === absolutePath);
    });

    const hasNextArticle = createMemo(() => {
        return !!findNextArticle(articleIndex(), 1);
    });

    function handleContextMenu(event: Event) {
        event.stopPropagation();
        event.preventDefault();
    }

    return (
        <div
            ref={entryRef} {...other}
            class={clsx("relative book-entry text-m ml-3 border-l-[3px] border-l-gray dark:border-l-darkgray", props.class)}
            data-absolute-path={absolutePath}
            data-data-path={dataPath}
            onContextMenu={handleContextMenu}
        >
            <Show when={dragEntry()}>
                <div class="drop-zone drop-zone-inside absolute z-10 inset-0" />
            </Show>

            <Show when={local.entry.hasContent || local.entry.children} fallback={
                <header class="text-gray dark:text-darkgray pt-4">
                    {title}
                </header>
            }>
                <div class="entry-title flex justify-between items-center gap-2 pl-3" classList={{
                    "bg-light dark:bg-black": currentArticleIndex() === articleIndex(),
                }}>
                    <Show when={local.entry.hasContent || local.entry.children && hasNextArticle()} fallback={(
                        <p class="text-gray dark:text-darkgray">
                            {title}
                        </p>
                    )}>
                        <A href={`/book/${absolutePath}`} class={"flex-1"} onClick={() => setOpen(true)}>
                            <p class={articleChanges.has(absolutePath) ? "text-changed dark:text-changed-dark" : "text-black dark:text-gray"}>
                                {title}
                            </p>
                        </A>
                    </Show>

                    <Show when={local.entry.isDownloadable}>
                        <button type="button" class="p-2" onClick={() => {
                            const a = document.createElement("a");
                            a.download = title;
                            a.href = `${window.location.origin}/book/${absolutePath}`;
                            a.click();
                        }}>
                            <PixelImage
                                src="/img/book/Download.png"
                                darkSrc="/img/book/Download Dark.png"
                                alt="Download article"
                                w={5} h={7} scale={3} />
                        </button>
                    </Show>

                    <Show when={local.entry.children}>
                        <button type="button" class="p-2" onClick={() =>
                            setOpen(!open())
                        }>
                            <PixelImage
                                src={open() ? "/img/book/Retract.png" : "/img/book/Expand.png"}
                                darkSrc={open() ? "/img/book/Retract Dark.png" : "/img/book/Expand Dark.png"}
                                alt="Open/Close Section" w={5} h={5} scale={3} />
                        </button>
                    </Show>
                </div>

                <Show when={local.entry.children && open()}>
                    <Entries of={local.entry.children}>
                        {(path, entry) => (
                            <Entry
                                title={entry().title ?? path}
                                path={path}
                                entry={entry()}
                                parent={absolutePath}
                                dataParent={dataPath} />
                        )}
                    </Entries>
                </Show>
            </Show>

            <Show when={dragEntry()}>
                <div class="drop-zone drop-zone-above absolute z-10 inset-0 h-3" />
                <div class="drop-zone drop-zone-below absolute z-10 bottom-0 h-3 left-0 right-0" />
            </Show>
        </div>
    )
}
