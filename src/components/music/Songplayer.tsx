import { PixelImage } from "@components/shared/PixelImage";
import { Accessor, createContext, createSignal, ParentProps, Setter, Signal, useContext } from "solid-js";
import { Slider } from "./Slider";

export interface MusicItemProps {
    title: string;
    description: string;
    song: string;
    spectrum: Array<number>;
    length: number;
    storedVolume: number;
    storedGlobalVolume: number;

    getPlaytime?: Accessor<number>;
    setPlaytime?: Setter<number>;

    getVolume?: Accessor<number>;
    setVolume?: Setter<number>;
}

interface SongplayerContextProps {
    song: Accessor<MusicItemProps>;
    setSong: Setter<MusicItemProps>;
    playing: Accessor<boolean>;
    setPlaying: Setter<boolean>;

    isThisSong: (data: MusicItemProps) => boolean;
    play: () => void;
    pause: () => void;
    resume: () => void;
    toggle: () => void;
    setVolume: (volume: number) => void;
    togglePlay: (e: KeyboardEvent) => void;

    player: () => HTMLAudioElement;
}

const SongplayerContext = createContext<SongplayerContextProps>({} as SongplayerContextProps);

export default function useSongplayer() {
    return useContext(SongplayerContext);
}

export function Songplayer(props: ParentProps) {

    const [song, setSong]: Signal<MusicItemProps> = createSignal(null);
    const [playing, setPlaying]: Signal<boolean> = createSignal(null);
    const [open, setOpen] = createSignal<boolean>(null);
    const [volume, setVolume] = createSignal(0.5);

    let player!: HTMLAudioElement;

    let intervalID: number;

    const isThisSong = (data: MusicItemProps) => {
        return song != undefined && song() != null && song() == data;
    }

    const play = () => {
        player.src = song().song;
        resume();
    }

    const setPlayerVolume = (volume: number) => {
        player.volume = song().getVolume() * volume;
    }

    const pause = () => {
        song().setPlaytime(player.currentTime);
        setPlaying(false);
        player.pause();
        window.clearInterval(intervalID);
    }

    const resume = () => {
        player.currentTime = song().getPlaytime();
        setPlaying(true);
        player.play();
        intervalID = window.setInterval(() => {
            song().setPlaytime(player.currentTime);
        }, 200)
    }

    const toggle = () => {
        if (playing()) {
            pause();
        } else {
            resume();
        }
    }

    const togglePlay = (e: KeyboardEvent) => {
        if (e.code == "Space") {
            e.preventDefault();
            if (song() !== null) {
                toggle();
            }
        }
    }

    const toggleMute = () => {
        if (volume() !== 0) {
            song().storedGlobalVolume = volume();
            setVolume(0);
        } else {
            setVolume(song().storedGlobalVolume);
        }
        setPlayerVolume(volume());
    }

    // on spacebar press toggle play/pause
    document.addEventListener('keydown', togglePlay);

    return (
        <SongplayerContext.Provider value={{
            song,
            playing,
            setSong,
            setPlaying,
            isThisSong,
            play,
            pause,
            resume,
            toggle,
            setVolume: setPlayerVolume,
            togglePlay,
            player: () => player
        }}>
            <audio ref={player} class="hidden" loop></audio>
            {props.children}
            <div id="song-player" class="fixed z-10 bottom-0 left-0 right-0 h-16 bg-white border-t-2 border-t-black px-6 py-4 grid grid-cols-[1fr,1fr] sm:grid-cols-[1fr,1fr,1fr] align-middle" classList={{
                'open': song() !== null && open() === null || song() !== null && open()
            }}> {song() !== null && <>
                <div id="song-player-toggle" class="absolute right-[0.75rem] -top-10 w-12 h-10 bg-white border-x-2 border-t-2 border-black grid place-content-center" onClick={() => setOpen(true)}>
                    <div class="-mt-2">
                        <PixelImage src="/img/music/open.png" w={5} h={5} scale={4} alt={"Open the player"} />
                    </div>
                </div>

                <div class="flex align-middle gap-4 justify-start">
                    <button onClick={toggle}>
                        <PixelImage src={
                            playing() ?
                                "/img/music/pause.png" :
                                "/img/music/play.png"
                        } w={5} h={5} scale={4} alt={"Toggle song playback"} />
                    </button>
                </div>

                <div class="hidden sm:flex align-middle gap-4 justify-center">
                    <p class="leading-7">
                        {song().title}
                    </p>
                </div>

                <div class="flex align-middle gap-4 md:gap-12 justify-end">
                    <button onClick={() => { toggleMute() }}>
                        <PixelImage src={
                            volume() == 0 ?
                                "/img/music/muted.png" :
                                volume() < 0.5 ?
                                    "/img/music/silent.png" :
                                    "/img/music/loud.png"
                        } w={10} h={8} scale={3} alt={"Volume indicator"} />
                    </button>

                    <div class="w-24 md:w-56">
                        <Slider signal={[volume, setVolume]} step={0.05} onChange={setPlayerVolume} range={1} />
                    </div>

                    <button onClick={() => setOpen(false)}>
                        <PixelImage src="/img/music/close.png" w={5} h={5} scale={4} alt={"Close the player"} />
                    </button>
                </div>

                <div id="playback-progress" class="absolute -top-[5px] left-0 right-0">
                    <Slider signal={[song().getPlaytime, song().setPlaytime]} range={song().length} onChange={value => {
                        player.currentTime = value;
                    }} />
                </div>
            </>}
            </div>
        </SongplayerContext.Provider>
    )
}
