import { Component, For, onMount } from "solid-js";
import { ChapterText, DownArrow, SVGCircle, SVGLine, VerticalLine } from "@components/shared/Styling";
import { TypedText } from "@components/shared/TypedText";
import ProjectList, { genHeight } from "@data/Projects";
import { Project } from "@components/projects/Project";
import { Game } from "@components/home/Game";
import { Password } from "@components/home/Password";
import { Featured } from "@components/projects/Featured";
import useLoading from "@components/shared/Loading";

const Projects: Component = () => {

    const { load } = useLoading();

    load(...[
        "/img/projects/featured.png",
        "/img/projects/heast-messenger.png",
        "/img/projects/heast-icon.png",
        "/img/projects/skys-horizon.png",
        "/img/projects/table-tennis.png"
    ]);

    return <>
        <Password />
        <Game />

        <Featured />

        <section class="relative pt-52 pb-36 flex flex-col gap-5 justify-center items-center">
            <h1 class="title">
                <TypedText>
                    My personal projects
                </TypedText>
            </h1>

            <p class="title max-w-lg">
                A list of projects I created over the last couple of years.
            </p>

            <div class="styling left-16 bottom-0 w-1 h-40 bg-gray" />
            <div class="styling left-5 bottom-8" style={`writing-mode: tb-rl; transform: rotate(-180deg);`}>
                0.1 Projects
            </div>
            <div class="styling left-16 bottom-40 w-4 h-4">
                <svg viewBox="0 0 16 16" stroke="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="8" cy="8" r="8" />
                </svg>
            </div>
        </section>

        <For each={ProjectList}>
            {(item, index) => <Project
                project={item}
                decoration={[
                    <ChapterText text={`0.${index() + 2} ${item.title}`} />,
                    <VerticalLine />,
                    <SVGCircle top={30} />,
                    <SVGLine top={40} height={genHeight()} />,
                    <DownArrow top={80} />
                ]}
            />}
        </For>

        <section class="relative h-20">
            <div class="styling left-16 top-0 w-1 h-4 bg-gray" />
            <div class="styling left-16 top-4 w-4 h-4">
                <svg viewBox="0 0 16 16" stroke="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="8" cy="8" r="8" />
                </svg>
            </div>
        </section>
    </>
}

export default Projects;
