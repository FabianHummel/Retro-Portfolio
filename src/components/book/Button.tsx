import type { IArticle } from "@pages/Book";
import { A } from "@solidjs/router";
import { clsx } from "clsx";
import { type Component, type JSX, Show, splitProps } from "solid-js";

interface ButtonProps extends JSX.HTMLAttributes<HTMLAnchorElement> {
    article: IArticle;
}

export const Button: Component<ButtonProps> = (props) => {
    const [local, other] = splitProps(props, ["article"])

    return (
        <Show when={local.article}>
            <A
                href={`/book/${local.article.path}`}
                {...other}
                class={clsx(
                    `book-button flex-1 px-3 py-1 text-m content-center cursor-pointer leading-none font-main no-underline`,
                    other.class,
                )}
            >
                {local.article.title}
            </A>
        </Show>
    );
}
