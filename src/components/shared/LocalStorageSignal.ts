import {createEffect, createSignal, onMount} from "solid-js";

export default function createLocalStorageSignal<T>(key: string, value?: T | undefined) {
    const [getter, setter] = createSignal(value);

    onMount(() => {
        const value = localStorage.getItem(key);
        if (value) {
            setter(JSON.parse(value));
        }
    });

    createEffect(() => {
        localStorage.setItem(key, JSON.stringify(getter()));
    });

    return [getter, setter] as const;
}