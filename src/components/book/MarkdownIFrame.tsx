import { applyClasses } from "@pages/Book";
import { clsx } from "clsx";
import { parseQueryString } from "pdfjs-dist/web/pdf_viewer.mjs";
import { createEffect, JSX } from "solid-js";

function MarkdownIFrame(props: JSX.IframeHTMLAttributes<HTMLIFrameElement> & { className: string[] }) {
    let ref: HTMLIFrameElement;
    let parentRef: HTMLDivElement;

    let resizeObserver = new ResizeObserver(([entry]) => {
        console.log(entry.contentRect.width, ref.width);
        ref.style.scale = `${entry.contentRect.width / ref.width}`;
    });

    createEffect(() => {
        parentRef.style.aspectRatio = `${ref.width}/${ref.height}`;

        resizeObserver.observe(parentRef);

        const searchParamIndex = props.src.lastIndexOf('?');
        const queryParams = parseQueryString(props.src.substring(searchParamIndex));
        applyClasses(parentRef, queryParams);
    });

    return <div ref={parentRef} class={clsx(props.class, "iframe-container relative")}>
        <iframe ref={ref} {...props} class="absolute inset-0 origin-top-left" />
    </div>
}

export default MarkdownIFrame;
