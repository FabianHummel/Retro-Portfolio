import { Articles } from "@data/Book";
import { setIndex } from "@pages/Book";
import { Component, JSX, splitProps } from "solid-js";

interface ButtonProps extends JSX.HTMLAttributes<HTMLDivElement> {
	index: number
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

	const [{ index }, other] = splitProps(props, ["index"])
	const entry = Articles[index]

	return (
		<p {...other} style={style} class="flex-1 p-6 text-m h-3 grid content-center cursor-pointer leading-none" onClick={() =>
			setIndex(index)}>
			{entry.title}
		</p>
	)
}