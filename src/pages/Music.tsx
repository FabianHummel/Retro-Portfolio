import { Component, createSignal, For, Signal } from "solid-js";
import { MusicItem, MusicItemProps } from "../components/music/MusicItem";
import { DownArrow, SVGCircle, SVGLine, VerticalLine } from "../components/Styling";
import { TypedText } from "../components/TypedText";
import MusicList from "../data/Music";

export let [song, setSong]: Signal<MusicItemProps> = createSignal(null);
export let [playing, setPlaying]: Signal<boolean> = createSignal(null);

export let player = document.querySelector<HTMLAudioElement>('#player');

let intervalID: number;

export const isThisSong = (data: MusicItemProps) => {
	return song != undefined && song() != null && song() == data;
}

export const play = () => {
	player.src = song().song;
	resume();
}

export const setVolume = (volume: number) => {
	player.volume = volume;
}

export const pause = () => {
	song().setPlaytime(player.currentTime);
	player.pause();
	clearInterval(intervalID);
}

export const resume = () => {
	player.currentTime = song().getPlaytime();
	player.play();
	intervalID = setInterval(() => {
		song().setPlaytime(player.currentTime);
	}, 200)
}

const Music: Component = () => {
	return <>
		<section class="relative pt-52 pb-36 flex flex-col gap-5 justify-center items-center">
			<h1 class="font-main text-l">
				<TypedText>
					~ Music I made ~
				</TypedText>
			</h1>

			<p class="font-main text-s max-w-sm text-center">
				Use headphones for the best experience - Enjoy!
			</p>

			<div class="absolute left-16 bottom-0 w-1 h-40 bg-gray -translate-x-1/2" />
			<div class={`absolute left-16 bottom-40 w-4 h-4 fill-gray -translate-x-1/2`}>
				<svg viewBox="0 0 16 16" stroke="none" xmlns="http://www.w3.org/2000/svg">
					<circle cx="8" cy="8" r="8" />
				</svg>
			</div>
		</section>

		<For each={ MusicList }>
			{ (music) => <MusicItem data={music} decoration={[
				<VerticalLine />
			]} /> }
		</For>
	</>
}

export default Music