import { theme } from "@src/App";
import { type Component, type JSX, splitProps } from "solid-js";

interface PixelImageProps extends JSX.ImgHTMLAttributes<HTMLImageElement> {
    src: string, darkSrc?: string, w: number, h: number, scale: number
}

export const PixelImage: Component<PixelImageProps> = (props) => {
    const [local, other] = splitProps(props, ["w", "h", "scale", "src", "darkSrc"])
    return (
        <img alt={props.alt} {...other} src={(theme() === "light" || !local.darkSrc) ? local.src : local.darkSrc} class={`pixel aspect-square ${other.class}`} draggable={false} style={`
			min-width: ${local.w * local.scale}px;
			min-height: ${local.h * local.scale}px;
			width: ${local.w * local.scale}px;
			height: ${local.h * local.scale}px;
			image-rendering: pixelated;
		`} />
    )
}
