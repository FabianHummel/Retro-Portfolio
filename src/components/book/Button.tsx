import { BookContext } from "@pages/Book";
import { A } from "@solidjs/router";
import { clsx } from "clsx";
import { type Component, type JSX, Show, splitProps, useContext, createMemo } from "solid-js";

interface ButtonProps extends JSX.HTMLAttributes<HTMLAnchorElement> {
    direction: number;
    forceShow?: boolean;
}

export const Button: Component<ButtonProps> = (props) => {
    const [local, other] = splitProps(props, ["direction", "forceShow"]);

    const { findNextArticle, currentArticleIndex, currentArticle } = useContext(BookContext);

    const article = createMemo(() => findNextArticle(currentArticleIndex(), local.direction));

    function getFirstPathPart(path: string): string {
        const firstPart = path.includes('/') ? path.substring(0, path.indexOf('/')) : path;
        return firstPart.includes('.') ? firstPart.substring(0, firstPart.indexOf('.')) : firstPart;
    }

    return (
        <Show when={article() && (getFirstPathPart(article().path) === getFirstPathPart(currentArticle().path) || local.forceShow)}>
            <A
                href={`/book/${article().path}`}
                {...other}
                class={clsx(
                    `book-button flex-1 px-3 py-1 text-m content-center cursor-pointer leading-none font-main no-underline`,
                    other.class,
                )}
            >
                {article().title}
            </A>
        </Show>
    );
}
