import { Component, For, onMount } from "solid-js";
import { mouseDown } from "../../App";
import { player, isThisSong } from "../../pages/Music";
import { MusicItemProps } from "./MusicItem";

export const Spectrum : Component<{ data: MusicItemProps }> = (props) => {
	let spectrum : HTMLDivElement;

	const onSpectrumClick = (clientX: number) => {
		if (isThisSong(props.data)) {
			const rect = spectrum.getBoundingClientRect();
			const x = clientX - rect.left;
			const time = x / spectrum.clientWidth * props.data.length;
			player.currentTime = time;
			props.data.setPlaytime(time);
		}
	}

	onMount(() => {
		spectrum.addEventListener('mousemove', (e) => {
			if (mouseDown) {
				onSpectrumClick(e.clientX);
			}
		}); 
		spectrum.addEventListener('touchmove', (e) => {
			if (mouseDown) {
				onSpectrumClick(e.touches[0].clientX);
			}
		});
		spectrum.addEventListener('click', (e) => {
			onSpectrumClick(e.clientX);
		});
	})

	return (
		<div ref={spectrum} class="w-full h-full flex justify-evenly items-center cursor-pointer">
			<For each={ props.data.spectrum }>
				{ (item, index) =>
					<div style={`height: ${item * 50 + 50}%;`} class={`w-[3px] transition-colors duration-300 ${
						index() % 2 === 0 ? "hidden 2xl:block" : "block"
					} ${
						props.data.getPlaytime() / props.data.length <= index() / props.data.spectrum.length ? "bg-gray" : "bg-black"}
					`}></div>
				}
			</For>
		</div>
	)
}