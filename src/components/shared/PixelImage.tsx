import { Component } from "solid-js";

export const PixelImage: Component<{ src: string, w: number, h: number, scale: number, alt?: string }> = (props) => {
	return (
		<img class="pixel" src={props.src} alt={props.alt} draggable={false} style={`
			min-width: ${props.w * props.scale}px;
			min-height: ${props.h * props.scale}px;
			image-rendering: pixelated;
		`} />
	)
}