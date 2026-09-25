import { TypedText } from "@components/shared/TypedText";
import { type Component, For, type JSX, type JSXElement, splitProps } from "solid-js";
import clsx from "clsx";
import { SVGCircle } from "./Styling";

interface ChapterProps extends JSX.HTMLAttributes<HTMLDivElement> {
    title: string,
    text: JSX.Element[],
    decoration?: JSXElement[],
    graphics?: JSXElement
}

export const Chapter: Component<ChapterProps> = (props) => {
    const [local, other] = splitProps(props, ["title", "text", "decoration", "graphics"]);

    return (
        <section class={clsx("content mt-16 grid grid-cols-[1fr] grid-rows-[auto,auto] lg:grid-rows-[6rem,auto] gap-10 md:gap-x-20 md:gap-y-0", other.class)}>
            {/* text */}
            <div class="row-start-1">
                <h1 id={local.title.toLowerCase().replace(/\s/g, '-')}>
                    <TypedText onIntersect>
                        {local.title}
                    </TypedText>
                </h1>
            </div>
            <div class="row-start-2 flex flex-col gap-10">
                <For each={local.text}>
                    {(paragraph) => (
                        <p class="text-s"> {paragraph} </p>
                    )}
                </For>
            </div>

            {/* graphics */}
            {local.graphics ?
                <div class="md:row-start-2 flex flex-row md:flex-col justify-center items-center gap-5">
                    {local.graphics}
                </div>
                : null}

            {/* extra styling */}
            <For each={local.decoration}>
                {(element) => (
                    element
                )}
            </For>

            <SVGCircle top={0} />
            <SVGCircle top={100} />
        </section>
    )
}
