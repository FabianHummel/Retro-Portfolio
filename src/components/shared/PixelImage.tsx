import { Component, ComponentProps, JSX, splitProps } from "solid-js";
import {theme} from "@src/App";

interface PixelImageProps extends JSX.ImgHTMLAttributes<HTMLImageElement> {
    src: string, darkSrc?: string, w: number, h: number, scale: number, alt?: string
}

export const PixelImage: Component<PixelImageProps> = (props) => {
    const [local, other] = splitProps(props, ["w", "h", "scale", "src", "darkSrc"])
    return (
        <img {...other} src={(theme() === "light" || !local.darkSrc) ? local.src : local.darkSrc} class="pixel aspect-square" draggable={false} style={`
			min-width: ${local.w * local.scale}px;
			min-height: ${local.h * local.scale}px;
			width: ${local.w * local.scale}px;
			height: ${local.h * local.scale}px;
			image-rendering: pixelated;
		`} />
    )
}
