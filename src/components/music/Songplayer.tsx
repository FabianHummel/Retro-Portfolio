import VolumeIcon from "@components/music/VolumeIcon";
import { PixelImage } from "@components/shared/PixelImage";
import {
    type Accessor,
    createContext,
    createEffect,
    createSignal,
    on, onCleanup, onMount,
    type ParentProps,
    type Setter,
    type Signal,
    useContext
} from "solid-js";
import Slider from "./Slider";

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
    isPlaying: Accessor<boolean>;
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
    const [isPlaying, setPlaying]: Signal<boolean> = createSignal(false);
    const [open, setOpen] = createSignal<boolean>(null);

    let volumeFromStorage = parseFloat(localStorage.getItem(`master-volume`));
    if (Number.isNaN(volumeFromStorage)) volumeFromStorage = undefined;

    const [master, setMaster] = createSignal(volumeFromStorage ?? 0.33);
    const [playtime, setPlaytime] = createSignal(0);
    let storedMaster = master();

    let player: HTMLAudioElement;

    let frame: number;

    onMount(() => {
        frame = requestAnimationFrame(handleUpdate);

        document.addEventListener('keypress', onKeyPress);
    });

    onCleanup(() => {
        cancelAnimationFrame(frame);

        document.removeEventListener('keypress', onKeyPress);
    });

    function onKeyPress(event: KeyboardEvent) {
        if (event.code === "Space" || event.code === "MediaPlayPause") {
            event.preventDefault();
            if (song() !== null) {
                handleTogglePlaying();
            }
        }
        if (event.code === "MediaTrackNext") {
            // TODO: play next song
        }
        if (event.code === "MediaTrackPrevious") {
            // TODO: play previous song
        }
    }

    createEffect(on(master, () => {
        handleUpdateVolume();
    }));

    createEffect(on(song, () => {
        setPlaytime(0);
    }));

    function handleUpdate() {
        setPlaytime(player.currentTime);
        frame = requestAnimationFrame(handleUpdate);
    }

    function isThisSong(data: MusicItemProps) {
        return song !== undefined && song() != null && song() === data;
    }

    function handlePlay() {
        player.src = song().song;
        handleUpdateVolume();
        handleResume();
    }

    function handleUpdateVolume() {
        localStorage.setItem("master-volume", master().toString());
        if (player === undefined) return;
        player.volume = (song()?.volume ?? 0.75) * master();
    }

    function handlePause() {
        setPlaytime(player.currentTime);
        setPlaying(false);
        player.pause();
    }

    function handleResume() {
        player.currentTime = playtime();
        setPlaying(true);
        player.play();
    }

    function handleTogglePlaying() {
        if (isPlaying()) {
            handlePause();
        } else {
            handleResume();
        }
    }

    function handleToggleMute() {
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

    function handleSetPlaytime(time: number) {
        player.currentTime = time;
    }

    return (
        <SongplayerContext.Provider value={{
            song,
            isPlaying: isPlaying,
            setSong,
            setPlaying,
            isThisSong,
            play: handlePlay,
            pause: handlePause,
            resume: handleResume,
            toggle: handleTogglePlaying,
            updateVolume: handleUpdateVolume,
            playtime,
            setPlaytime: handleSetPlaytime
        }}>
            <audio ref={player} class="hidden" loop>
                <track kind="captions" />
            </audio>

            {props.children}

            <div id="song-player" class="fixed z-10 bottom-0 left-0 right-0 h-16 bg-white dark:bg-dark border-t-2 border-t-black px-6 py-4 grid grid-cols-[1fr,1fr] lg:grid-cols-[1fr,1fr,1fr] align-middle" classList={{
                'open': song() !== null && open() !== false
            }}> {song() !== null && (
                <>
                    <button type="button" id="song-player-toggle" class="absolute right-[0.75rem] -top-10 w-12 h-10 bg-white dark:bg-dark border-x-2 border-t-2 border-black dark:border-black grid place-content-center"
                        onClick={() => setOpen(true)}
                    >
                        <div class="-mt-2">
                            <PixelImage src="/img/music/open.png" darkSrc="/img/music/open Dark.png" w={5} h={5} scale={4} alt={"Open the player"} />
                        </div>
                    </button>

                    <div class="flex align-middle gap-4 justify-start">
                        <button type="button" onClick={handleTogglePlaying}>
                            <PixelImage src={
                                isPlaying() ?
                                    "/img/music/pause.png" :
                                    "/img/music/play.png"
                            } darkSrc={
                                isPlaying() ?
                                    "/img/music/pause Dark.png" :
                                    "/img/music/play Dark.png"
                            } w={5} h={5} scale={4} alt={"Toggle song playback"} />
                        </button>

                        <p class="hidden max-lg:block leading-7">
                            {song().title}
                        </p>
                    </div>

                    <div class="hidden lg:flex align-middle gap-4 justify-center">
                        <p class="leading-7">
                            {song().title}
                        </p>
                    </div>

                    <div class="flex align-middle gap-4 justify-end">
                        <button type="button" onClick={() => { handleToggleMute() }}>
                            <VolumeIcon volume={master()} />
                        </button>

                        <div class="w-24 sm:w-56">
                            <Slider signal={[master, setMaster]} step={0.05} onChange={handleMasterVolumeChanged} range={1} />
                        </div>

                        <button type="button" onClick={() => setOpen(false)}>
                            <PixelImage src="/img/music/close.png" darkSrc="/img/music/close Dark.png" w={5} h={5} scale={4} alt={"Close player"} />
                        </button>
                    </div>

                    <div id="playback-progress" class="absolute -top-[5px] left-0 right-0">
                        <Slider signal={[playtime, setPlaytime]} range={song().length} onChange={handleSetPlaytime} />
                    </div>
                </>
            )}
            </div>
        </SongplayerContext.Provider>
    )
}
