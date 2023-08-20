import { Component, ComponentProps, JSX, splitProps } from "solid-js";

interface PixelImageProps extends JSX.ImgHTMLAttributes<HTMLImageElement> {
	src: string, w: number, h: number, scale: number, alt?: string
}

export const PixelImage: Component<PixelImageProps> = (props) => {
	const [{ w, h, scale }, other] = splitProps(props, ["w", "h", "scale"])
	return (
		<img {...other} class="pixel aspect-square" draggable={false} style={`
			min-width: ${w * scale}px;
			min-height: ${h * scale}px;
			width: ${w * scale}px;
			height: ${h * scale}px;
			image-rendering: pixelated;
		`} />
	)
}