import type { ParentProps } from "solid-js";
import { createSignal, onMount } from "solid-js";

export const [theme, setTheme] = createSignal<string>(localStorage.theme);

export default function App(props: ParentProps) {
    onMount(() => {
        const theme =
            localStorage.theme === "dark" ||
            (!("theme" in localStorage) &&
                window.matchMedia("(prefers-color-scheme: dark)").matches);
        setTheme(theme ? "dark" : "light");
    });

    return (
        <main class="max-w-[1500px] mx-auto">
            {props.children}
        </main>
    );
}
