import {For, onCleanup, onMount} from "solid-js";
import {mouseDown, theme} from "@src/App";
import useSongplayer, {MusicItemProps} from "@components/music/Songplayer";
import interact from "interactjs";

interface SpectrumProps {
    data: MusicItemProps;
    onChange?: (time: number) => void;
}

export default function Spectrum(props: SpectrumProps) {
    let spectrum: HTMLDivElement;
    let interactInstance: any;

    const { isThisSong, playtime } = useSongplayer();

    function onSpectrumClick(clientX: number) {
        if (isThisSong(props.data)) {
            const rect = spectrum.getBoundingClientRect();
            const x = clientX - rect.left;
            const time = x / spectrum.clientWidth * props.data.length;
            props.onChange?.(time);
        }
    }

    onMount(() => {
        interactInstance = interact(spectrum)
            .draggable({
                onmove: (event) => {
                    onSpectrumClick(event.clientX);
                }
            })
            .styleCursor(false)
            .on(["tap", "click"], (event) => {
                onSpectrumClick(event.clientX);
            })
    });

    onCleanup(() => {
        interactInstance.unset();
    });

    return (
        <div ref={spectrum} class={`w-full h-full flex justify-evenly items-center touch-none
            ${isThisSong(props.data) ? "cursor-pointer" : "cursor-not-allowed"}
        `}>
            <For each={props.data.spectrum}>
                {(item, index) =>
                    <div style={`height: ${item * 100}%;`} class={`min-h-[3px] w-[3px] transition-colors duration-300
                        ${index() % 2 === 0 ? "hidden 2xl:block" : "block"} 
                        ${isThisSong(props.data) && playtime() / props.data.length > index() / props.data.spectrum.length 
                        ? ( theme() === "light" ? "bg-black" : "bg-gray") 
                        : ( theme() === "light" ? "bg-gray" : "bg-darkgray")}
                    `} />
                }
            </For>
        </div>
    )
}
