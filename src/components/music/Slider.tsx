import { Component, onMount, Signal } from "solid-js";
import { mouseDown } from "@src/App";
import { PixelImage } from "@components/shared/PixelImage";

export const Slider: Component<{ signal?: Signal<number>, onChange: (value: number) => void }> = (props) => {
    let slider: HTMLDivElement;

    const onSliderHandle = (clientX: number) => {
        if (!props.signal) return;

        const rect = slider.getBoundingClientRect();
        const x = clientX - rect.left - 4;
        const volume = Math.min(Math.max(x / slider.clientWidth, 0), 1);
        props.onChange(volume);
        props.signal[1](volume);
    }

    onMount(() => {
        slider.addEventListener('mousemove', (e) => {
            if (mouseDown) {
                onSliderHandle(e.clientX);
            }
        });
        slider.addEventListener('touchmove', (e) => {
            if (mouseDown) {
                onSliderHandle(e.touches[0].clientX);
            }
        });
        slider.addEventListener('click', (e) => {
            onSliderHandle(e.clientX);
        });
    })

    function step(max: number, incr: number) {
        return Math.ceil(props.signal[0]() * max / incr) * incr
    }

    return (
        <div ref={slider} class="w-full h-full flex items-center relative my-auto cursor-pointer select-none" classList={{
            "disabled": !props.signal
        }}>
            <div class="h-[10px] bg-black" style={`width: ${step(100, 5)}%`} />
            <div class="h-[10px] bg-gray" style={`width: ${100 - step(100, 5)}%`} />

            <div class="absolute -translate-x-1/2" style={`left: ${step(100, 5)}%`}>
                <PixelImage src="img/music/knob.png" w={5} h={5} scale={3} />
            </div>
        </div>
    )
}
