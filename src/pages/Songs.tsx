import Music from "@components/music/Music";
import type { MusicItemProps } from "@components/music/Songplayer";
import { Chapter } from "@components/shared/Chapter";
import useLoading from "@components/shared/Loading";
import { ChapterText, DownArrow, SVGCircle, SVGLine, VerticalLine } from "@components/shared/Styling";
import { TypedText } from "@components/shared/TypedText";
import { type Component, createSignal, For, onMount, Show } from "solid-js";

const Songs: Component = () => {

    const { load, startLoading } = useLoading();

    const [music, setMusic] = createSignal<MusicItemProps[]>(null);

    onMount(() => {
        const complete = startLoading(0.3);
        fetch("/music/data.json").then(async res => await res.json() as MusicItemProps[]).then((music) => {
            setMusic(music);
            complete();
        });
    });

    load(
        "/img/music/pause.png",
        "/img/music/pause Dark.png",
        "/img/music/play.png",
        "/img/music/play Dark.png",
        "/img/music/muted.png",
        "/img/music/muted Dark.png",
        "/img/music/silent.png",
        "/img/music/silent Dark.png",
        "/img/music/loud.png",
        "/img/music/loud Dark.png",
        "/img/music/knob.png",
        "/img/music/knob Dark.png",
    );

    return <>
        <section class="relative pt-52 pb-36 flex flex-col gap-5 justify-center items-center">
            <h1 class="title">
                <TypedText>
                    ~ Music I made ~
                </TypedText>
            </h1>

            <p class="title">
                Use headphones for the best <br /> experience - Enjoy!
            </p>

            <div class="styling left-16 bottom-0 w-1 h-40 bg-gray dark:bg-darkgray" />

            <SVGCircle class="bottom-40" />
        </section>

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

        <Show when={music() !== null} fallback={
            "Loading..."
        }>
            <For each={music()}>
                {(music, index) =>
                    <Music data={music} index={index()} />
                }
            </For>
        </Show>

        <section class="relative h-20">
            <SVGCircle />
        </section>
    </>
}

export default Songs
