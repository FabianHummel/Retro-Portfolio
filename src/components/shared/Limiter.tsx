import { Component, JSX } from "solid-js";

export const Limiter : Component<JSX.BaseHTMLAttributes<HTMLBaseElement>> = (props) => {
	return (
		<main class="max-w-[1800px] mx-auto bg-white">
			{ props.children }
		</main>
	)
}