import VolumeIcon from "@components/music/VolumeIcon";
import { PixelImage } from "@components/shared/PixelImage";
import { songs } from "@pages/Songs";
import {
    type Accessor,
    createContext,
    createEffect,
    createSignal,
    on, onCleanup, onMount,
    type ParentProps,
    type Setter,
    type Signal,
    useContext,
    Show
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

        navigator.mediaSession.setActionHandler("play", () => {
            if (song() !== null) {
                handleResume();
            }
        });

        navigator.mediaSession.setActionHandler("pause", () => {
            if (song() !== null) {
                handlePause();
            }
        });

        navigator.mediaSession.setActionHandler("stop", () => {
            if (song() !== null) {
                stopSong();
            }
        });

        navigator.mediaSession.setActionHandler("seekto", (details) => {
            if (song() !== null && details.seekTime !== undefined) {
                handleSetPlaytime(details.seekTime);
            }
        });

        navigator.mediaSession.setActionHandler("previoustrack", () => {
            playSiblingSong(false);
        });

        navigator.mediaSession.setActionHandler("nexttrack", () => {
            playSiblingSong(true);
        });

        navigator.mediaSession.setActionHandler("seekforward", (details) => {
            if (song() !== null && details.seekOffset !== undefined) {
                handleSetPlaytime(playtime() + details.seekOffset);
            }
        });

        navigator.mediaSession.setActionHandler("seekbackward", (details) => {
            if (song() !== null && details.seekOffset !== undefined) {
                handleSetPlaytime(playtime() - details.seekOffset);
            }
        });
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
        if (event.code === "MediaTrackPrevious") {
            playSiblingSong(false)
        }
        if (event.code === "MediaTrackNext") {
            playSiblingSong(true)
        }
    }

    createEffect(on(master, () => {
        handleUpdateVolume();
    }));

    createEffect(on(song, song => {
        setPlaytime(0);

        if (song === null) {
            navigator.mediaSession.metadata = null;
            return;
        }

        navigator.mediaSession.metadata = new MediaMetadata({
            artist: "Fabian Hummel",
            title: song.title,
            album: "Portfolio",
            artwork: [{
                src: "/img/music/media-art.jpg",
                sizes: "512x512",
                type: "image/png"
            }]
        });
    }));

    function handleUpdate() {
        setPlaytime(player.currentTime);
        frame = requestAnimationFrame(handleUpdate);
    }

    function isThisSong(data: MusicItemProps) {
        return song()?.song === data.song;
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

    function stopSong() {
        setSong(null);
        setPlaying(false);
        setPlaytime(0);
        player.pause();
    }

    function playSiblingSong(next: boolean) {
        if (songs() === null) return;

        const currentIdx = songs().findIndex((s) => s.song === song().song);

        if (!next && (currentIdx === 0 || playtime() > 5)) {
            setPlaytime(0);
            handleResume();
            return;
        }

        if (currentIdx === songs().length - 1 && next) {
            return;
        }

        setSong(songs()[next ? currentIdx + 1 : currentIdx - 1]);
        handlePlay();
    }

    return (
        <SongplayerContext.Provider
            value={{
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
                setPlaytime: handleSetPlaytime,
            }}
        >
            <audio ref={player} class="hidden" loop>
                <track kind="captions" />
            </audio>

            {props.children}

            <div
                id="song-player"
                class="fixed z-10 bottom-0 left-0 right-0 h-16 bg-white dark:bg-dark border-t-2 border-t-black px-6 py-4 grid grid-cols-[1fr,1fr] lg:grid-cols-[1fr,1fr,1fr] align-middle"
                classList={{
                    'open': song() !== null
                }}
            >
                <Show when={song() !== null}>
                    <div class="flex align-middle gap-4 justify-start">
                        <button type="button" onClick={() => playSiblingSong(false)} class="hidden sm:block">
                            <PixelImage
                                src="/img/music/previous.png"
                                darkSrc="/img/music/previous Dark.png"
                                w={5}
                                h={5}
                                scale={4}
                                alt={"Play previous song"}
                            />
                        </button>

                        <button type="button" onClick={handleTogglePlaying}>
                            <PixelImage
                                src={
                                    isPlaying()
                                        ? "/img/music/pause.png"
                                        : "/img/music/play.png"
                                }
                                darkSrc={
                                    isPlaying()
                                        ? "/img/music/pause Dark.png"
                                        : "/img/music/play Dark.png"
                                }
                                w={5}
                                h={5}
                                scale={4}
                                alt={"Toggle song playback"}
                            />
                        </button>

                        <button type="button" onClick={() => playSiblingSong(true)} class="hidden sm:block">
                            <PixelImage
                                src="/img/music/next.png"
                                darkSrc="/img/music/next Dark.png"
                                w={5}
                                h={5}
                                scale={4}
                                alt={"Play next song"}
                            />
                        </button>

                        <p class="hidden max-lg:block leading-7 font-main">
                            {song().title}
                        </p>
                    </div>

                    <div class="hidden lg:flex align-middle gap-4 justify-center font-main">
                        <p class="leading-7">{song().title}</p>
                    </div>

                    <div class="flex align-middle gap-4 justify-end">
                        <button
                            type="button"
                            onClick={() => {
                                handleToggleMute();
                            }}
                        >
                            <VolumeIcon volume={master()} />
                        </button>

                        <div class="w-24 md:w-56">
                            <Slider
                                signal={[master, setMaster]}
                                step={0.05}
                                onChange={handleMasterVolumeChanged}
                                range={1}
                            />
                        </div>

                        <button type="button" onClick={() => stopSong()}>
                            <PixelImage
                                src="/img/music/close.png"
                                darkSrc="/img/music/close Dark.png"
                                w={5}
                                h={5}
                                scale={4}
                                alt={"Close player"}
                            />
                        </button>
                    </div>

                    <div
                        id="playback-progress"
                        class="absolute -top-[5px] left-0 right-0"
                    >
                        <Slider
                            signal={[playtime, setPlaytime]}
                            range={song().length}
                            onChange={handleSetPlaytime}
                        />
                    </div>
                </Show>
            </div>
        </SongplayerContext.Provider>
    );
}
