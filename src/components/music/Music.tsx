import { Component, createSignal } from "solid-js";
import { PixelImage } from "@components/shared/PixelImage";
import { TypedText } from "@components/shared/TypedText";
import { Slider } from "@components/music/Slider";
import { Spectrum } from "@components/music/Spectrum";
import useSongplayer, { MusicItemProps } from "@components/music/Songplayer";

export const Music: Component<{ data: MusicItemProps, index: number }> = (props) => {

    const { song, playing, pause, resume, setSong, play, setVolume, isThisSong } = useSongplayer();

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
                pause();
                console.log(data.title, 'paused');
            } else {
                volumeChange(data.getVolume());
                resume();
                console.log(data.title, 'resumed');
            }
        } else {
            setSong(data);
            volumeChange(data.getVolume());
            play();
            console.log(data.title, 'playing');
        }
    }

    const volumeChange = (value: number) => {
        if (isThisSong(data)) {
            setVolume(value);
        }
    }

    const toggleMute = () => {
        if (data.getVolume() !== 0) {
            props.data.storedVolume = data.getVolume();
            data.setVolume(0);
        } else {
            data.setVolume(props.data.storedVolume);
        }
        volumeChange(data.getVolume());
    }

    return (
        <section class="content grid md:grid-cols-[2fr,1.5fr] lg:grid-cols-[2fr,3fr] grid-rows-[1fr,1fr,auto] gap-x-20">
            {/* text */}
            <div class="row-start-1">
                <h2 class="text-l">
                    <TypedText>
                        {`${props.index + 1}. ${data.title}`}
                    </TypedText>
                </h2>
            </div>
            <div class="row-start-2 flex gap-10 md:px-5">
                <button onClick={() => { togglePlay() }}>
                    <PixelImage src={
                        playing() && song() == data ?
                            "/img/music/pause.png" :
                            "/img/music/play.png"
                    } w={5} h={5} scale={4} alt={"Toggle song playback"} />
                </button>
                <button onClick={() => { toggleMute() }}>
                    <PixelImage src={
                        data.getVolume() == 0 ?
                            "/img/music/muted.png" :
                            data.getVolume() < 0.5 ?
                                "/img/music/silent.png" :
                                "/img/music/loud.png"
                    } w={10} h={8} scale={3} alt={"Volume indicator"} />
                </button>
                <Slider signal={[data.getVolume, data.setVolume]} step={0.05} onChange={volumeChange} range={1} />
            </div>
            <div class="md:row-span-2 py-5 gap-5 h-28 my-auto">
                <Spectrum data={data} />
            </div>

            {/* decoration */}
            <div class="styling absolute left-16 bottom-0 w-1 h-full bg-gray -translate-x-1/2" />
        </section>
    )
}
