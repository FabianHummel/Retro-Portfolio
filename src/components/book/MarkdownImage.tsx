import { createEffect, JSX } from "solid-js";

function MarkdownImageComponent(props: JSX.ImgHTMLAttributes<HTMLImageElement>) {
    const fileExtension = props.src.substring(props.src.lastIndexOf("."));

    let ref: HTMLImageElement & HTMLVideoElement;

    createEffect(() => {
        ref.style.display = "block";
        if (props.src === "null") {
            ref.style.display = "none";
        }
    });

    return [".webm", ".mov", ".mp4"].includes(fileExtension) ? (
        <video ref={ref} controls src={props.src}>
            <track kind="captions" />
        </video>
    ) : (
        <img ref={ref} alt={props.alt} {...props} />
    )
}

export default MarkdownImageComponent;
