import { Component } from "solid-js";
import {theme} from "@src/App";

export const Tag: Component<{ tag: string }> = ({ tag }) => {
	return (
		<p class="projects-tag" style={`border-image-source: url('${
			   theme() === "light" ? "/img/Tag.png" : "/img/Tag Dark.png"
		   }');`}>
			{tag}
		</p>
	)
}