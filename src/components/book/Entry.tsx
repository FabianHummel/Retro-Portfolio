import { PixelImage } from "@components/shared/PixelImage";
import { BookContext, type IEntry } from "@pages/Book";
import { Entries } from "@solid-primitives/keyed";
import { A } from "@solidjs/router";
import { clsx } from "clsx";
import { type Component, createEffect, createSignal, type JSX, onMount, Show, splitProps, useContext } from "solid-js";

export interface EntryProps extends JSX.HTMLAttributes<HTMLDivElement> {
    title: string;
    entry: IEntry;
}

export const Entry: Component<EntryProps> = (props) => {
    const [local, other] = splitProps(props, ["title", "entry"])
    const [open, setOpen] = createSignal(false);

    const { currentArticleIndex, articles, findNextArticle, closeMobileSidebar } = useContext(BookContext);

    onMount(() => {
        setOpen(window.localStorage.getItem(`book:${local.entry.path}`) === "true");
    });

    createEffect(() => {
        window.localStorage.setItem(`book:${local.entry.path}`, open() ? "true" : "false");
    });

    const articleIndex = articles().findIndex(a => a.path === local.entry.path);
    const nextArticle = findNextArticle(articleIndex, 1);

    return (
        <div {...other} class={clsx("text-m ml-3 border-l-[3px] border-l-gray dark:border-l-darkgray", props.class)}>
            <Show when={local.entry.path} fallback={
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
                        <A href={local.entry.hasContent ? `/book/${local.entry.path}` : nextArticle.path} class={"flex-1"} onClick={() => {
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
                            a.href = `${window.location.origin}/book/${local.entry.path}`;
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
                            {(title, entry) => (
                                <Entry title={title} entry={entry()} />
                            )}
                        </Entries>
                    </Show>
                </Show>
            </Show>
        </div>
    )
}
