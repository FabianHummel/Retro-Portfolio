import { Article, Articles, getArticleHref } from "@data/Book";
import { Link } from "@solidjs/router";
import { Component, JSX, splitProps } from "solid-js";

interface ButtonProps extends JSX.HTMLAttributes<HTMLAnchorElement> {
	article: Article
}

export const Button: Component<ButtonProps> = (props) => {
	const style = `
		border-image-source: url('/img/book/Link Background.png');
		border-image-slice: 3;
		border-width: 1rem;
		border-style: solid;
		border-image-repeat: stretch;
		image-rendering: pixelated;
	`

	const [{ article }, other] = splitProps(props, ["article"])

	return (
		<Link href={`/book/${getArticleHref(article)}`} {...other} style={`${style}`} class={`flex-1 p-6 text-m h-3 grid content-center cursor-pointer leading-none ${other.class}`}>
			{article.title}
		</Link>
	)
}