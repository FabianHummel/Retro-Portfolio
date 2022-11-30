import { Component, createSignal, For, Signal } from "solid-js";
import { MusicItem, MusicItemProps } from "../components/music/MusicItem";
import { ChapterText, DownArrow, SVGCircle, SVGLine, VerticalLine } from "../components/Styling";
import { TypedText } from "../components/TypedText";
import MusicList from "../data/Music";
import { Chapters } from "../components/Chapters";
import { Chapter } from "../components/Chapter";

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

		{/* <section class="relative pr-24 pl-36">
			<Chapters title="Chapters on this page" chapters={[
				{ title: "How I got to making music", section: "0.1", link: "" },
				{ title: "Music for games", section: "0.2", link: "" },
				{ title: "My very own 'Spotify'", section: "0.3", link: "" },
			]} />

			<div class="absolute left-16 bottom-0 w-1 h-full bg-gray -translate-x-1/2" />
		</section> */}

		<Chapter title="How I got to making music" text={[
			"It all started with 10 year old me playing the first notes on my new guitar. Ever since, I loved creating my own melodies. When I got older, I more and more fell in love with synthwave music. I wanted to create my own music in that style, but I was very uncreative and inexperienced at that time.",
		]} decoration={[
			<ChapterText text="0.1 Music" />,
			<VerticalLine />,
			<SVGCircle top={30} />,
			<SVGLine top={40} height={100} />,
			<DownArrow top={80} />
		]} />

		<Chapter title="Music for games" text={[
			"When my obsession with video games programming kicked in, I then had a goal of making simple tracks for my games. That's when I found out about Beepbox, a free online tool that allows me to create music with a simple interface. It's relatively easy to get familiar with, perfect for beginners like me.",
		]} decoration={[
			<ChapterText text="0.2 Music for games" />,
			<VerticalLine />,
			<SVGCircle top={60} />,
			<DownArrow top={40} />
		]} />

		<Chapter title="My very own Music Player" text={[
			"The songs listed below are some of the better ones I created. You can directly listen to them by clicking on the play button beneath the song title. Scrub through the track by dragging the waveform to the desired place. Have fun!",
		]} decoration={[
			<ChapterText text="0.3 Music Player" />,
			<VerticalLine />,
			<SVGCircle top={40} />,
			<SVGLine top={80} height={200} />,
			<DownArrow top={50} />,
			<DownArrow top={150} />,
		]} />

		<For each={MusicList}>
			{(music) => <MusicItem data={music} />}
		</For>
	</>
}

export default Music