import { BookContext } from "@pages/Book";
import { type Component, useContext } from "solid-js";

export interface ArticleLinkProps {
    path: string;
}

export const ArticleLink: Component<ArticleLinkProps> = (props) => {

    const { articles } = useContext(BookContext);

    const article = articles().find(a => a.path === props.path);

    return (
        <a href={`#/book/${props.path}`} class="article-link">{article.title}</a>
    )
}
