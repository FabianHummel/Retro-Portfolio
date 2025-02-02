import { Component } from "solid-js";
import { PixelImage } from "@components/shared/PixelImage";
import { Logo } from "@components/shared/Logo";
import {theme} from "@src/App";

export const Footer: Component = () => {
	return (
		<footer class="relative px-10 lg:px-20 pt-10 md:pt-20 pb-48 border-t-2 border-t-black grid grid-cols-[1fr] lg:grid-cols-[1fr,30rem] md:grid-cols-[1fr,20rem]"
				style={`${
					theme() === "light" ? `background: 
					url("/img/footer/Foreground.png") repeat-x bottom, 
					url("/img/footer/Background.png") repeat-x bottom;` :
					`background:
					url("/img/footer/Foreground Dark.png") repeat-x bottom,
					url("/img/footer/Background Dark.png") repeat-x bottom;`
					
				}
						background-size: auto 16rem, auto 16rem;`}>

			<div class="flex flex-row gap-x-5 items-center justify-center md:justify-start">
				<div class="h-16 fill-black dark:fill-gray hidden md:block">
					<Logo />
				</div>
				<p class="items-center leading-none text-center md:text-start">Made with <span class="inline-block align-middle">
					<PixelImage src="img/Heart.png" w={6} h={6} scale={3} />
					</span> by
					<br />
					Fabian Hummel
				</p>
			</div>

			<table class="mt-16 md:mt-0 text-s text-center md:text-left">
				<thead class="leading-loose underline underline-offset-4">
					<tr>
						<th></th>
						<th>Featured</th>
					</tr>
				</thead>
				<tbody class="leading-none">
					<tr>
						<td><a href="https://github.com/FabianHummel" target="_blank">Github</a></td>
						<td><a href="https://github.com/FabianHummel/CPP-TableTennis-Game" target="_blank">Table Tennis</a></td>
					</tr>
					<tr>
						<td><a href="/">Portfolio</a></td>
						<td><a href="https://github.com/Heast-Messenger/Heast/tree/master" target="_blank">Heast Msg</a></td>
					</tr>
					<tr>
						<td class="text-gray dark:text-darkgray">LinkedIn</td>
					</tr>
				</tbody>
			</table>
		</footer>
	)
}