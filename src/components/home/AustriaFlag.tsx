import clsx from "clsx";
import { JSX } from "solid-js";

export default function AustriaFlag(props: JSX.SvgSVGAttributes<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="27" height="18" {...props} class={clsx(props.class, "inline align-sub rounded-sm ml-1")}>
            <rect fill="#c8102e" width="27" height="18" />
            <rect fill="#fff" y="6" width="27" height="6" />
        </svg>
    )
}
