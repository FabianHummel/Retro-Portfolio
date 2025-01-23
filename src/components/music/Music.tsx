import {Component, createEffect, createSignal, on, onMount} from "solid-js";
import { PixelImage } from "@components/shared/PixelImage";
import { TypedText } from "@components/shared/TypedText";
import Slider from "@components/music/Slider";
import Spectrum from "@components/music/Spectrum";
import useSongplayer, { MusicItemProps } from "@components/music/Songplayer";
import VolumeIcon from "@components/music/VolumeIcon";

interface MusicProps {
    data: MusicItemProps;
    index: number;
}

export default function Music(props: MusicProps) {

    let volumeFromStorage = parseFloat(localStorage.getItem(`volume:${props.data.song}`));
    if (isNaN(volumeFromStorage)) volumeFromStorage = undefined;
    let storedVolumeFromStorage = parseFloat(localStorage.getItem(`storedVolume:${props.data.song}`));
    if (isNaN(storedVolumeFromStorage)) storedVolumeFromStorage = undefined;

    const { song, playing, pause, resume, setSong, play, isThisSong, updateVolume, setPlaytime } = useSongplayer();

    const [volume, setVolume] = createSignal(volumeFromStorage ?? 0.75);
    let storedVolume = storedVolumeFromStorage ?? 0.75;

    createEffect(on(volume, () => {
        localStorage.setItem(`volume:${props.data.song}`, volume().toString());
        localStorage.setItem(`storedVolume:${props.data.song}`, storedVolume.toString());
        props.data.volume = volume();
    }))

    function togglePlay() {
        if (isThisSong(props.data)) {
            if (playing !== undefined && playing()) {
                pause();
            } else {
                resume();
            }
        } else {
            setSong(props.data);
            play();
        }
    }

    function toggleMute() {
        if (volume() !== 0) {
            storedVolume = volume();
            setVolume(0);
        } else {
            setVolume(storedVolume);
        }
        updateVolume();
    }

    function handleVolumeChanged(value: number) {
        storedVolume = value;
        setVolume(value);
        updateVolume();
    }

    return (
        <section class="content grid md:grid-cols-[2fr,1.5fr] lg:grid-cols-[2fr,3fr] grid-rows-[1fr,1fr,auto] gap-x-20">
            {/* text */}
            <div class="row-start-1">
                <h2 class="text-l">
                    <TypedText>
                        {`${props.index + 1}. ${props.data.title}`}
                    </TypedText>
                </h2>
            </div>
            <div class="row-start-2 flex gap-10 md:px-5">
                <button onClick={() => { togglePlay() }}>
                    <PixelImage src={
                        playing() && song() == props.data ?
                            "/img/music/pause.png" :
                            "/img/music/play.png"
                    } darkSrc={
                        playing() && song() == props.data ?
                            "/img/music/pause Dark.png" :
                            "/img/music/play Dark.png"
                    } w={5} h={5} scale={4} alt={"Toggle song playback"} />
                </button>
                <button onClick={() => { toggleMute() }}>
                    <VolumeIcon volume={volume()} />
                </button>
                <Slider signal={[volume, setVolume]} step={0.05} onChange={handleVolumeChanged} range={1} />
            </div>
            <div class="md:row-span-2 py-5 gap-5 h-28 my-auto">
                <Spectrum data={props.data} onChange={(time) => {
                    setPlaytime(time);
                }} />
            </div>

            {/* decoration */}
            <div class="styling absolute left-16 bottom-0 w-1 h-full bg-gray dark:bg-darkgray -translate-x-1/2" />
        </section>
    )
}
