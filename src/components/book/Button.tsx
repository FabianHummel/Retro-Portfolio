import { Link } from "@solidjs/router";
import { Component, JSX, splitProps } from "solid-js";
import {Entry} from "@pages/Book";
import {theme} from "@src/App";

interface ButtonProps extends JSX.HTMLAttributes<HTMLAnchorElement> {
	title: string;
	article: Entry;
}

export const Button: Component<ButtonProps> = (props) => {
	const [local, other] = splitProps(props, ["article", "title"])

	return (
		<Link href={`/book/${local.article.path}`} {...other} class={`book-button flex-1 p-6 text-m h-3 grid content-center cursor-pointer leading-none ${other.class}`}
			style={`border-image-source: url('${
				theme() === "light" ? "/img/book/Link Background.png" : "/img/book/Link Background Dark.png"
			}');`}>
			{local.title}
		</Link>
	)
}