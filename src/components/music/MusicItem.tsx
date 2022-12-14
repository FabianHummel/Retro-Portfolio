import { Accessor, Component, createSignal, For, JSXElement, Setter } from "solid-js";
import { song, playing, setPlaying, pause, resume, setSong, play, setVolume, isThisSong } from "../../pages/Music";
import { PixelImage } from "../PixelImage";
import { TypedText } from "../TypedText";
import { Slider } from "./Slider";
import { Spectrum } from "./Spectrum";

export interface MusicItemProps {
	title: string;
	description: string;
	song: string;
	spectrum: Array<number>;
	length: number;

	getPlaytime?: Accessor<number>;
	setPlaytime?: Setter<number>;

	getVolume?: Accessor<number>;
	setVolume?: Setter<number>;
}

export const MusicItem : Component<{ data: MusicItemProps }> = (props) => {

	let storedVolume : number;

	const data = props.data;
	[data.getPlaytime, data.setPlaytime] = createSignal(
		data.getPlaytime !== undefined ? data.getPlaytime() : 0
	);

	[data.getVolume, data.setVolume] = createSignal(
		data.getVolume !== undefined ? data.getVolume() : 0.5
	);

	const togglePlay = () => {
		if (isThisSong(data)) {
			if (playing !== undefined && playing()) {
				setPlaying(false);
				pause();
				console.log(data.title, 'paused');
			} else {
				setPlaying(true);
				volumeChange();
				resume();
				console.log(data.title, 'resumed');
			}
		} else {
			setSong(data);
			volumeChange();
			setPlaying(true);
			play();
			console.log(data.title, 'playing');
		}
	}

	const volumeChange = () => {
		if (isThisSong(data)) {
			setVolume(data.getVolume());
		}
	}

	const toggleMute = () => {
		if (data.getVolume() !== 0) {
			storedVolume = data.getVolume();
			data.setVolume(0);
		} else {
			data.setVolume(storedVolume);
		}
		volumeChange();
	}

	return (
		<section class="content grid md:grid-cols-[2fr,1.5fr] lg:grid-cols-[2fr,3fr] grid-rows-[1fr,1fr,auto] gap-x-20">
			{/* text */}
			<div class="row-start-1">
				<h2 class="text-l">
					<TypedText>
						{data.title}
					</TypedText>
				</h2>
			</div>
			<div class="row-start-2 flex gap-10 md:px-5">
				<button onClick={() => { togglePlay() }}>
					{ playing() && song() == data ?
						<PixelImage src="img/music/pause.png" w={5} h={5} scale={4} alt={ "Pause the song" } /> :
						<PixelImage src="img/music/play.png" w={5} h={5} scale={4} alt={ "Play the song" } />
					}
				</button>
				<button onClick={() => { toggleMute() }}>
					{ data.getVolume() == 0 ? 
						<PixelImage src="img/music/muted.png" w={10} h={8} scale={3} alt={ "Muted" } /> :

					  data.getVolume() < 0.5 ?
					  	<PixelImage src="img/music/silent.png" w={10} h={8} scale={3} alt={ "Playing" } /> :
					  	<PixelImage src="img/music/loud.png" w={10} h={8} scale={3} alt={ "Playing" } />
					}
				</button>
				<Slider signal={[data.getVolume, data.setVolume]} onChange={volumeChange} />
			</div>
			<div class="md:row-span-2 py-5 gap-5 h-28 my-auto">
				<Spectrum data={data} />
			</div>

			{/* decoration */}
			<div class="styling absolute left-16 bottom-0 w-1 h-full bg-gray -translate-x-1/2" />
		</section>
	)
}