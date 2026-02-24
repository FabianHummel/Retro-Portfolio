import type { JSX } from "solid-js";

function MarkdownImageComponent(props: JSX.ImgHTMLAttributes<HTMLImageElement>) {
    const fileExtension = props.src.substring(props.src.lastIndexOf("."));

    return [".webm", ".mov", ".mp4"].includes(fileExtension) ? (
        <video controls src={props.src}>
            <track kind="captions" />
        </video>
    ) : (
        <img alt={props.alt} {...props} />
    )
}

export default MarkdownImageComponent;
