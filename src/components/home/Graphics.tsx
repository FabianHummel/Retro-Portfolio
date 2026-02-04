import type { Component } from "solid-js";

export const Graphics: Component<{ image: string, text?: string }> = (props) => {
    return <>
        <div class="relative w-60 h-60">
            <div class="absolute w-full h-full stroke-gray dark:stroke-darkgray">
                <ImageBorder />
            </div>
            <div class="absolute top-[2.5%] left-[2.5%] w-[95%] h-[95%] bg-cover bg-center rounded-full" style={
                `background-image: url("${props.image}");`
            } />
        </div>

        <p class="font-main text-gray dark:text-darkgray text-s rotate-[-7.5deg] max-w-[15rem]" hidden={!props.text}>
            <span class="ml-20 inline-block rotate-180">
                <svg style="scale: 3" class="fill-gray dark:fill-darkgray" xmlns="http://www.w3.org/2000/svg"
                    width="5" height="6" viewBox="0 0 5 6">
                    <title>Stylizied arrow</title>
                    <polygon points="5 3 5 4 4 4 4 5 3 5 3 6 2 6 2 5 1 5 1 4 0 4 0 3 2 3 2 0 3 0 3 3 5 3"
                        stroke-width="0" />
                </svg>
            </span>
            <br />
            {props.text}
        </p>
    </>
}

const ImageBorder: Component<{}> = () => {
    return (
        <svg class="animate-spin" viewBox="0 0 256 256" fill="none" overflow="visible"
            xmlns="http://www.w3.org/2000/svg">
            <title>Stylizied arrow</title>
            <circle cx="128" cy="128" r="128" stroke-width="6" stroke-dasharray="16 15" />
        </svg>
    )
}
