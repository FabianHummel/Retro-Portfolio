import { A } from "@solidjs/router";
import { type Component, createSignal, createEffect, useContext, Index } from "solid-js";
import { BookContext, type IBook, type IEntry } from "@pages/Book";

export interface BreadcrumbItem {
    title: string;
    path: string;
    hasContent?: boolean;
}

interface EntryWithTitle extends IEntry {
    title?: string;
}

export const Breadcrumbs: Component = () => {
    const { currentArticleIndex, articles, book, findNextArticle } = useContext(BookContext);
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
        const bookData = book();
        if (!bookData) {
            return;
        }

        // Find the path to this article in the book hierarchy
        function findPath(node: IBook, path: (EntryWithTitle & { path: string })[]): (EntryWithTitle & { path: string })[] | null {
            for (const [entryPath, entry] of Object.entries(node)) {
                if (entryPath === article.path) {
                    return [...path, { ...entry, path: entryPath }];
                }
                if (entry.children) {
                    const result = findPath(entry.children, [...path, { ...entry, path: entryPath }]);
                    if (result) return result;
                }
            }
            return null;
        }

        const pathToArticle = findPath(bookData, []);

        if (pathToArticle) {
            for (const entry of pathToArticle) {
                // For entries without content, find the next article after them
                let linkPath = entry.path;
                if (!entry.hasContent && entry.path) {
                    // Find article index that matches this path prefix
                    const articleIndex = articles().findIndex(a => a.path === entry.path);
                    if (articleIndex !== -1) {
                        const nextArticle = findNextArticle(articleIndex, 1);
                        linkPath = nextArticle?.path || entry.path;
                    }
                }

                crumbs.push({
                    title: entry.title || "",
                    path: linkPath || "",
                    hasContent: entry.hasContent
                });
            }
        }

        setBreadcrumbs(crumbs);
    });

    return (
        <nav class="mb-6 text-sm">
            <ol class="flex flex-wrap items-center gap-0 list-none">
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
        </nav>
    );
};
