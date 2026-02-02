import Slider from "@components/music/Slider";
import useSongplayer, { type MusicItemProps } from "@components/music/Songplayer";
import Spectrum from "@components/music/Spectrum";
import VolumeIcon from "@components/music/VolumeIcon";
import { PixelImage } from "@components/shared/PixelImage";
import { TypedText } from "@components/shared/TypedText";
import { createEffect, createSignal, on } from "solid-js";

interface MusicProps {
    data: MusicItemProps;
    index: number;
}

export default function Music(props: MusicProps) {

    let volumeFromStorage = parseFloat(localStorage.getItem(`volume:${props.data.song}`));
    if (Number.isNaN(volumeFromStorage)) volumeFromStorage = undefined;
    let storedVolumeFromStorage = parseFloat(localStorage.getItem(`storedVolume:${props.data.song}`));
    if (Number.isNaN(storedVolumeFromStorage)) storedVolumeFromStorage = undefined;

    const { song, isPlaying: playing, toggle, setSong, play, isThisSong, updateVolume, setPlaytime } = useSongplayer();

    const [volume, setVolume] = createSignal(volumeFromStorage ?? 0.75);
    let storedVolume = storedVolumeFromStorage ?? 0.75;

    createEffect(on(volume, () => {
        localStorage.setItem(`volume:${props.data.song}`, volume().toString());
        localStorage.setItem(`storedVolume:${props.data.song}`, storedVolume.toString());
        props.data.volume = volume();
    }))

    function handleTogglePlay() {
        if (isThisSong(props.data)) {
            toggle();
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
                <button type="button" onClick={() => { handleTogglePlay() }}>
                    <PixelImage src={
                        playing() && song() === props.data ?
                            "/img/music/pause.png" :
                            "/img/music/play.png"
                    } darkSrc={
                        playing() && song() === props.data ?
                            "/img/music/pause Dark.png" :
                            "/img/music/play Dark.png"
                    } w={5} h={5} scale={4} alt={"Toggle song playback"} />
                </button>
                <button type="button" onClick={() => { toggleMute() }}>
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
