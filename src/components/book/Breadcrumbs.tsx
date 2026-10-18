import { A } from "@solidjs/router";
import { type Component, createSignal, createEffect, useContext, Index } from "solid-js";
import { BookContext, toPath } from "@pages/Book";
import { JSX } from "solid-js/jsx-runtime";
import clsx from "clsx";

export interface BreadcrumbItem {
    title: string;
    path: string;
    hasContent?: boolean;
}

export const Breadcrumbs: Component = (props: JSX.HTMLAttributes<HTMLDivElement>) => {
    const { currentArticleIndex, articles, book } = useContext(BookContext);
    const [breadcrumbs, setBreadcrumbs] = createSignal<BreadcrumbItem[]>([]);

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

    return (
        <nav {...props} class={clsx(props.class, "pb-6 text-sm flex")}>
            <ol class="flex-1 flex flex-wrap items-center gap-0 list-none">
                <Index each={breadcrumbs()}>
                    {(crumb, index) => (
                        <li class="flex items-center font-main ml-0!" classList={{
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
        </nav>
    );
};
