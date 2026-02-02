import { PixelImage } from "@components/shared/PixelImage";
import interact from "interactjs";
import { createMemo, onCleanup, onMount, type Signal } from "solid-js";

interface SliderProps {
    signal?: Signal<number>;
    onChange(value: number): void;
    step?: number;
    range: number;
}

export default function Slider(props: SliderProps) {
    let slider: HTMLDivElement;
    let interactInstance: Interact.Interactable;

    const onSliderHandle = (clientX: number) => {
        if (!props.signal) return;

        const rect = slider.getBoundingClientRect();
        const x = clientX - rect.left - 4;
        const value = Math.min(
            props.range,
            Math.max(0, (x / rect.width) * props.range),
        );
        props.onChange?.(value);
        props.signal[1](value);
    };

    onMount(() => {
        interactInstance = interact(slider)
            .draggable({
                onmove: (event) => {
                    onSliderHandle(event.clientX);
                },
            })
            .styleCursor(false)
            .on(["pointerdown"], (event) => {
                onSliderHandle(event.clientX);
            });
    });

    onCleanup(() => {
        interactInstance.unset();
    });

    function step(value: number, incr: number) {
        return Math.ceil(value / incr) * incr;
    }

    const percent = createMemo(() => {
        if (!props.signal) return 0;

        let v = (props.signal[0]() / props.range) * 100;
        if (props.step) {
            v = step(v, props.step * 100);
        }
        return v;
    });

    return (
        <div
            ref={slider}
            class="w-full h-full flex items-center relative my-auto cursor-pointer select-none touch-none"
            classList={{
                disabled: !props.signal,
            }}
        >
            <div
                class="h-[10px] bg-black dark:bg-gray"
                style={`width: ${percent()}%`}
            />
            <div
                class="h-[10px] bg-gray dark:bg-darkgray"
                style={`width: ${100 - percent()}%`}
            />

            <div class="absolute -translate-x-1/2" style={`left: ${percent()}%`}>
                <PixelImage
                    src="img/music/knob.png"
                    darkSrc="img/music/knob Dark.png"
                    w={5}
                    h={5}
                    scale={3}
                />
            </div>
        </div>
    );
}
