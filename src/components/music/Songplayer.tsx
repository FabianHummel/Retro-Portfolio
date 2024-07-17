import { PixelImage } from "@components/shared/PixelImage";
import {
    Accessor,
    createContext,
    createEffect,
    createSignal,
    on, onCleanup, onMount,
    ParentProps,
    Setter,
    Signal,
    useContext
} from "solid-js";
import Slider from "./Slider";
import VolumeIcon from "@components/music/VolumeIcon";

export interface MusicItemProps {
    title: string;
    description: string;
    song: string;
    spectrum: Array<number>;
    length: number;
    volume?: number;
}

interface SongplayerContextProps {
    song: Accessor<MusicItemProps>;
    setSong: Setter<MusicItemProps>;
    playing: Accessor<boolean>;
    setPlaying: Setter<boolean>;
    playtime: Accessor<number>;
    setPlaytime: (time: number) => void;

    isThisSong(data: MusicItemProps): boolean;
    play(): void;
    pause(): void;
    resume(): void;
    toggle(): void;
    updateVolume(): void;
}

const SongplayerContext = createContext<SongplayerContextProps>({} as SongplayerContextProps);

export default function useSongplayer() {
    return useContext(SongplayerContext);
}

export function Songplayer(props: ParentProps) {

    const [song, setSong]: Signal<MusicItemProps> = createSignal(null);
    const [playing, setPlaying]: Signal<boolean> = createSignal(null);
    const [open, setOpen] = createSignal<boolean>(null);
    const [master, setMaster] = createSignal(0.75);
    const [playtime, setPlaytime] = createSignal(0);
    let storedMaster = master();

    let player!: HTMLAudioElement;

    let frame: number;

    onMount(() => {
        frame = requestAnimationFrame(handleUpdate);

        document.addEventListener('keypress', function(event) {
            if (event.code == "Space" || event.code == "MediaPlayPause") {
                event.preventDefault();
                if (song() !== null) {
                    togglePlay();
                }
            }
            if (event.code == "MediaTrackNext") {
                // TODO: play next song
            }
            if (event.code == "MediaTrackPrevious") {
                // TODO: play previous song
            }
        });
    });

    onCleanup(() => {
        cancelAnimationFrame(frame);
    });

    createEffect(on(master, () => {
        updateVolume();
    }));

    createEffect(on(song, () => {
        setPlaytime(0);
    }));

    function handleUpdate() {
        setPlaytime(player.currentTime);
        frame = requestAnimationFrame(handleUpdate);
    }

    function isThisSong (data: MusicItemProps) {
        return song != undefined && song() != null && song() == data;
    }

    function play () {
        player.src = song().song;
        updateVolume();
        resume();
    }

    function updateVolume() {
        player.volume = (song()?.volume ?? 0.75) * master();
    }

    function pause () {
        setPlaytime(player.currentTime);
        setPlaying(false);
        player.pause();
    }

    function resume () {
        player.currentTime = playtime();
        setPlaying(true);
        player.play();
    }

    function togglePlay () {
        if (playing()) {
            pause();
        } else {
            resume();
        }
    }

    function toggleMute () {
        if (master() !== 0) {
            storedMaster = master();
            setMaster(0);
        } else {
            setMaster(storedMaster);
        }
    }

    function handleMasterVolumeChanged(value: number) {
        setMaster(value);
    }

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
            toggle: togglePlay,
            updateVolume,
            playtime,
            setPlaytime: function (time: number) {
                setPlaytime(time);
                player.currentTime = time;
            },
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
                    <button onClick={togglePlay}>
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
                        <VolumeIcon volume={master()} />
                    </button>

                    <div class="w-24 md:w-56">
                        <Slider signal={[master, setMaster]} step={0.05} onChange={handleMasterVolumeChanged} range={1} />
                    </div>

                    <button onClick={() => setOpen(false)}>
                        <PixelImage src="/img/music/close.png" w={5} h={5} scale={4} alt={"Close the player"} />
                    </button>
                </div>

                <div id="playback-progress" class="absolute -top-[5px] left-0 right-0">
                    <Slider signal={[playtime, setPlaytime]} range={song().length} onChange={value => {
                        player.currentTime = value;
                    }} />
                </div>
            </>}
            </div>
        </SongplayerContext.Provider>
    )
}
