import { Link } from "@solidjs/router";
import { Component } from "solid-js";
import { playing } from "@pages/Songs";
import { Logo } from "@components/shared/Logo";
import { PixelImage } from "@components/shared/PixelImage";
import { height } from "@components/home/Game";
import { active } from "@components/home/Password";

export const Navbar: Component = () => {

	let navbar: HTMLElement;

	onscroll = () => {
		if (window.scrollY > 0) {
			navbar.classList.add("border-b-2");
		} else {
			navbar.classList.remove("border-b-2");
		}

		if (active() && window.scrollY < height()) {
			navbar.classList.add("-translate-y-full")
		} else {
			navbar.classList.remove("-translate-y-full")
		}
	}

	return (
		<nav ref={navbar} class="z-10 w-full h-32 fixed grid grid-cols-[auto,1fr] sm:grid-cols-[0.5fr_1fr_0.5fr] grid-rows-[1fr] place-items-center bg-white border-b-black transition-[border-bottom-width,transform]">
			<div class="w-full h-24 md:h-28 flex">
				<Link href="/" class="mx-5 fill-black">
					<Logo />
				</Link>
			</div>
			<h1 class="hidden sm:block font-main text-m md:text-l text-center">~ Fabian Hummel ~</h1>
			<div class="w-full px-5 sm:px-10 gap-7 flex justify-end items-center">
				<Link href="/book">
					<PixelImage src="img/Book.png" w={13} h={13} scale={3} />
				</Link>
				<Link href="/projects">
					<PixelImage src="img/Projects.png" w={12} h={12} scale={3} />
				</Link>
				<Link href="/music" class={`${playing() ? "animate-playing" : null}`}>
					<PixelImage src="img/Music.png" w={12} h={12} scale={3} />
				</Link>
				<Link href="https://github.com/FabianHummel">
					<PixelImage src="img/GitHub.png" w={12} h={12} scale={3} />
				</Link>
			</div>
		</nav>
	)
}