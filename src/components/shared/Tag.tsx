import { Component } from "solid-js";

export const Tag: Component<{ tag: string }> = ({ tag }) => {
	return (
		<p class="projects-tag">
			{tag}
		</p>
	)
}