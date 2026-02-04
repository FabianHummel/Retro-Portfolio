import { Songplayer } from "@components/music/Songplayer";
import { Footer } from "@components/shared/Footer";
import { Loading } from "@components/shared/Loading";
import { Navbar } from "@components/shared/Navbar";
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
        <Loading>
            <Songplayer>
                <Navbar />

                <main class="max-w-[1500px] mx-auto">{props.children}</main>

                <Footer />
            </Songplayer>
        </Loading>
    );
}
