import { Component, onCleanup, onMount } from "solid-js";
import { TypedText } from "@components/shared/TypedText";
import { Footer } from "@components/shared/Footer";
import { PixelImage } from "@components/shared/PixelImage";
import createLocalStorageSignal from "@components/shared/LocalStorageSignal";

const WelcomePage: Component = () => {

    let scrollContainer: HTMLDivElement;

    onMount(() => {
        scrollContainer = document.querySelector("#book-scroll-container");

        scrollContainer.addEventListener("scroll", onScroll);
    });

    onCleanup(() => {
        scrollContainer.removeEventListener("scroll", onScroll);
    });

    const [sidebarScrolled, setSidebarScrolled] = createLocalStorageSignal("mobile-sidebar-scrolled", false);

    function onScroll(ev: Event) {
        if (ev.target instanceof HTMLElement) {
            if (ev.target.scrollLeft < 50) {
                setSidebarScrolled(true);
            }
        }
    }

    return <>
        <section class="relative pt-36 pb-16 flex flex-col gap-5 justify-center items-center">
            <h1 class="font-main">
                <TypedText>
                    Welcome to my book!
                </TypedText>
            </h1>

            <p class="title max-w-lg"></p>

            <div class="block lg:hidden absolute top-10 left-2 w-[15rem]" classList={{
                "opacity-0": sidebarScrolled(),
                "animate-pulse": !sidebarScrolled(),
            }}>
                <PixelImage src="/img/book/Sidebar Hint.png" darkSrc="/img/book/Sidebar Hint Dark.png" w={6} h={5} scale={3} class="inline-block animate-sidebar-hint" />
                <span class="font-main text-s align-middle ml-3 leading-none">Swipe right to reveal the sidebar!</span>
            </div>
        </section>

        <section>
            <p class="mt-8">This collection of articles sort of serves as my mental notebook, where I capture random thoughts, progress updates and opinions regarding many different parts of my life, hobbies and interests.</p>

            <p class="mt-8">It was <i>- and still is -</i> one of my biggest goals and achievement of this portfolio. I love to have all of my beloved things organized in one place and this library helped me manifest this vision.</p>

            <p class="mt-8">Even though I wasn't doing exceptionally well in English and German classes, I nevertheless always liked to write stuff, so naturally I started documenting my projects. </p>
        </section>

        <Footer />
    </>
}

export default WelcomePage;
