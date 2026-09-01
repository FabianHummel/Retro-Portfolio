import { A } from "@solidjs/router";
import { type Component, createSignal, createEffect, useContext, Index, Show } from "solid-js";
import { BookContext, toPath, type IBook, type IEntry } from "@pages/Book";
import { AuthContext } from "@src/services/AuthContext";
import { PixelImage } from "@components/shared/PixelImage";

export interface BreadcrumbItem {
    title: string;
    path: string;
    hasContent?: boolean;
}

interface EntryWithTitle extends IEntry {
    title?: string;
}

export const Breadcrumbs: Component = () => {
    const { currentArticleIndex, articles, book, toggleEditMode, publishChanges } = useContext(BookContext);
    const [breadcrumbs, setBreadcrumbs] = createSignal<BreadcrumbItem[]>([]);

    const { isAuthenticated, loading, login, logout } = useContext(AuthContext);

    createEffect(() => {
        const index = currentArticleIndex();
        if (index === -1) {
            setBreadcrumbs([]);
            return;
        }

        const article = articles()[index];
        if (!article) {
            setBreadcrumbs([]);
            return;
        }

        const crumbs: BreadcrumbItem[] = [];
        let bookData = book();
        if (!bookData) {
            return;
        }

        let linkPath = "";
        for (const name of article.path.split('/')) {
            const [path, entry] = Object.entries(bookData).find(([path]) => path.startsWith(name));
            linkPath = toPath(linkPath) + (linkPath ? '/' : '') + path;

            crumbs.push({
                title: entry.title,
                path: linkPath,
                hasContent: entry.hasContent
            });

            bookData = entry.children;
        }

        setBreadcrumbs(crumbs);
    });

    function handleEditClick() {
        if (!isAuthenticated()) {
            login();
            return;
        }

        toggleEditMode();
    }

    return (
        <nav class="mb-6 text-sm flex">
            <ol class="flex-1 flex flex-wrap items-center gap-0 list-none">
                <Index each={breadcrumbs()}>
                    {(crumb, index) => (
                        <li class="flex items-center font-main ml-0" classList={{
                            "before:content-['/'] before:mx-6 before:text-gray before:dark:text-darkgray": index > 0,
                            "text-black dark:text-gray font-medium": index === breadcrumbs().length - 1,
                            "text-gray dark:text-darkgray": index !== breadcrumbs().length - 1
                        }}>
                            {index === breadcrumbs().length - 1 ? (
                                <span class="font-main">{crumb().title}</span>
                            ) : (
                                <A class="font-main" href={crumb().path ? `/book/${crumb().path}` : "#"}
                                    classList={{
                                        "hover:text-black dark:hover:text-gray": true
                                    }}>
                                    {crumb().title}
                                </A>
                            )}
                        </li>
                    )}
                </Index>
            </ol>

            <div class="flex gap-4 p-3 pr-0 items-center font-main">
                <Show when={isAuthenticated()}>
                    <button
                        type="button"
                        class="relative before:absolute before:-inset-2"
                        onClick={publishChanges}
                    >
                        <PixelImage
                            src="/img/book/Publish.png"
                            darkSrc="/img/book/Publish Dark.png"
                            w={5} h={5} scale={3} />
                    </button>
                </Show>

                <button
                    type="button"
                    class="relative before:absolute before:-inset-2"
                    onClick={handleEditClick}
                >
                    <PixelImage
                        src="/img/book/Edit.png"
                        darkSrc="/img/book/Edit Dark.png"
                        w={5} h={5} scale={3} />
                </button>

                <Show when={isAuthenticated()}>
                    <Show when={!loading()} fallback={
                        <p>Loading...</p>
                    }>
                        <button
                            type="button"
                            onClick={logout}
                            class="relative before:absolute before:-inset-2"
                        >
                            <PixelImage
                                src="/img/book/Logout.png"
                                darkSrc="/img/book/Logout Dark.png"
                                w={6} h={5} scale={3} />
                        </button>
                    </Show>
                </Show>
            </div>
        </nav>
    );
};
