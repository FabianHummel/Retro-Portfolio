import { PixelImage } from "@components/shared/PixelImage";
import { BookContext, type IEntry } from "@pages/Book";
import { Entries } from "@solid-primitives/keyed";
import { A } from "@solidjs/router";
import { clsx } from "clsx";
import { type Component, createEffect, createSignal, type JSX, onMount, Show, splitProps, useContext, on } from "solid-js";

export interface EntryProps extends JSX.HTMLAttributes<HTMLDivElement> {
    title: string;
    path: string;
    entry: IEntry;
}

export const Entry: Component<EntryProps> = (props) => {
    const [local, other] = splitProps(props, ["title", "path", "entry"])
    const [open, setOpen] = createSignal(false);

    const { currentArticleIndex, articles, findNextArticle, closeMobileSidebar } = useContext(BookContext);

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

    const articleIndex = articles().findIndex(a => a.path === local.path);
    const nextArticle = findNextArticle(articleIndex, 1);

    return (
        <div ref={entryRef} {...other} class={clsx("text-m ml-3 border-l-[3px] border-l-gray dark:border-l-darkgray", props.class)}>
            <Show when={local.entry.hasContent || local.entry.children} fallback={
                <header class="text-gray dark:text-darkgray pt-4">
                    {local.title}
                </header>
            }>
                <div class="flex justify-between items-center gap-2 pl-3" classList={{
                    "bg-light dark:bg-black": currentArticleIndex() === articleIndex,
                }}>
                    <Show when={local.entry.hasContent || local.entry.children && nextArticle} fallback={(
                        <p class="text-gray dark:text-darkgray">
                            {local.title}
                        </p>
                    )}>
                        <A href={`/book/${local.path}`} class={"flex-1"} onClick={() => {
                            setOpen(true);
                            closeMobileSidebar();
                        }}>
                            <p class="text-black dark:text-gray">
                                {local.title}
                            </p>
                        </A>
                    </Show>

                    <Show when={local.entry.isDownloadable}>
                        <button type="button" class="p-2" onClick={() => {
                            const a = document.createElement("a");
                            a.download = local.title;
                            a.href = `${window.location.origin}/book/${local.path}`;
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

                <Show when={local.entry.children}>
                    <Show when={open()}>
                        <Entries of={local.entry.children}>
                            {(path, entry) => (
                                <Entry title={entry().title ?? path} path={path} entry={entry()} />
                            )}
                        </Entries>
                    </Show>
                </Show>
            </Show>
        </div>
    )
}
