import { Component } from "solid-js";
import { PixelImage } from "../PixelImage";

export const Graphics: Component<{ image: string, text: string }> = (props) => {
	return <>
		<div class="relative w-60 h-60">
			<div class="absolute w-full h-full stroke-gray">
				<ImageBorder />
			</div>
			<div class="absolute top-[2.5%] left-[2.5%] w-[95%] h-[95%] bg-cover bg-center rounded-full" style={
				`background-image: url("${props.image}");`
			} />
		</div>

		<p class="text-gray text-s rotate-[-7.5deg] max-w-[15rem]">
			<span class="ml-20 inline-block rotate-180">
				<PixelImage src="img/Continue Light.png" w={5} h={6} scale={3} alt="Continue" />
			</span>
			<br />
			{props.text}
		</p>
	</>
}

const ImageBorder: Component<{}> = () => {
	return (
		<svg class="animate-spin" viewBox="0 0 256 256" fill="none" overflow="visible" xmlns="http://www.w3.org/2000/svg">
			<circle cx="128" cy="128" r="128" stroke-width="6" stroke-dasharray="16 15" />
		</svg>
	)
}