import {For, onMount} from "solid-js";
import {mouseDown} from "@src/App";
import useSongplayer, {MusicItemProps} from "@components/music/Songplayer";

interface SpectrumProps {
    data: MusicItemProps;
    onChange?: (time: number) => void;
}

export default function Spectrum(props: SpectrumProps) {
    let spectrum: HTMLDivElement;

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
        spectrum.addEventListener('mousemove', (e) => {
            if (mouseDown) {
                onSpectrumClick(e.clientX);
            }
        });
        spectrum.addEventListener('touchmove', (e) => {
            if (mouseDown) {
                onSpectrumClick(e.touches[0].clientX);
            }
        });
        spectrum.addEventListener('click', (e) => {
            onSpectrumClick(e.clientX);
        });
    })

    return (
        <div ref={spectrum} class={`w-full h-full flex justify-evenly items-center
            ${isThisSong(props.data) ? "cursor-pointer" : "cursor-not-allowed"}
        `}>
            <For each={props.data.spectrum}>
                {(item, index) =>
                    <div style={`height: ${item * 100}%;`} class={`w-[3px] transition-colors duration-300
                        ${index() % 2 === 0 ? "hidden 2xl:block" : "block"} 
                        ${isThisSong(props.data) && playtime() / props.data.length > index() / props.data.spectrum.length ? "bg-black" : "bg-gray"}
                    `} />
                }
            </For>
        </div>
    )
}
