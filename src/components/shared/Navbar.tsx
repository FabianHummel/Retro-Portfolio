import useSongplayer from "@components/music/Songplayer";
import { Logo } from "@components/shared/Logo";
import { PixelImage } from "@components/shared/PixelImage";
import { A } from "@solidjs/router";
import { setTheme, theme } from "@src/App";
import { type Component, createEffect, onCleanup, onMount } from "solid-js";

export const Navbar: Component = () => {

    let navbar: HTMLElement;

    const { isPlaying: playing } = useSongplayer();

    onMount(() => {
        navbar.classList.remove("border-b-2");

        window.addEventListener("scroll", onScroll);
    });

    onCleanup(() => {
        window.removeEventListener("scroll", onScroll);
    });

    const onScroll = () => {
        if (window.scrollY > 0) {
            navbar.classList.add("border-b-2");
        } else {
            navbar.classList.remove("border-b-2");
        }
    }

    createEffect(() => {
        if (theme() === 'dark') {
            document.documentElement.classList.add('dark');
            localStorage.theme = 'dark';
        } else if (theme() === 'light') {
            document.documentElement.classList.remove('dark');
            localStorage.theme = 'light';
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.removeItem('theme');
        }
    });

    return (
        <nav ref={navbar} class="z-40 w-full h-[var(--navbar-height)] fixed grid grid-cols-[auto,1fr] lg:grid-cols-[0.5fr_1fr_0.5fr] grid-rows-[1fr] place-items-center bg-white dark:bg-dark border-b-2 border-b-black dark:border-b-black transition-[border-bottom-width,transform]">
            <div class="w-full h-20 sm:h-28 flex">
                <A href="/" class="mx-5 fill-black dark:fill-gray">
                    <Logo />
                </A>
            </div>
            <h1 class="hidden lg:block font-main text-m md:text-l text-center whitespace-nowrap">~ Fabian Hummel ~</h1>
            <div class="w-full px-5 sm:px-10 gap-7 flex justify-end items-center">
                <A href="/book">
                    <PixelImage src="img/Book.png" darkSrc="img/Book Dark.png" w={12} h={12} scale={3} />
                </A>
                <A href="/projects">
                    <PixelImage src="img/Projects.png" darkSrc="img/Projects Dark.png" w={12} h={12} scale={3} />
                </A>
                <A href="/music" class={`${playing() ? "animate-playing" : null}`}>
                    <PixelImage src="img/Music.png" darkSrc="img/Music Dark.png" w={12} h={12} scale={3} />
                </A>
                <A href="/github">
                    <PixelImage src="img/GitHub.png" darkSrc="img/GitHub Dark.png" w={12} h={12} scale={3} />
                </A>
                {theme() === "light" ? (
                    <button type="button" onPointerDown={() => setTheme("dark")}>
                        <PixelImage src="img/Moon.png" w={12} h={12} scale={3} />
                    </button>
                ) : (
                    <button type="button" onPointerDown={() => setTheme("light")}>
                        <PixelImage src="img/Sun.png" w={12} h={12} scale={3} />
                    </button>
                )}
            </div>
        </nav>
    )
}
