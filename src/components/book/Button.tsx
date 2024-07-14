import { Link } from "@solidjs/router";
import { Component, JSX, splitProps } from "solid-js";
import {Entry} from "@pages/Book";

interface ButtonProps extends JSX.HTMLAttributes<HTMLAnchorElement> {
	title: string;
	article: Entry;
}

export const Button: Component<ButtonProps> = (props) => {
	const [local, other] = splitProps(props, ["article", "title"])

	return (
		<Link href={`/book/${local.article.path}`} {...other} class={`book-button flex-1 p-6 text-m h-3 grid content-center cursor-pointer leading-none ${other.class}`}>
			{local.title}
		</Link>
	)
}