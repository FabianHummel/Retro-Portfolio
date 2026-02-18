import { ImageWithText } from "@components/home/Graphics";
import { Chapter } from "@components/shared/Chapter";
import { ChapterText, DownArrow, SVGCircle, SVGLine, VerticalLine } from "@components/shared/Styling";
import { TypedText } from "@components/shared/TypedText";
import { A } from "@solidjs/router";
import { theme } from "@src/App";
import type { Component } from "solid-js";

const Home: Component = () => {
    function getAge() {
        var today = new Date();
        var birthDate = new Date(2006, 8, 21);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    return <>
        <section id="home-section" class="relative h-screen flex flex-col justify-center items-center select-none">
            <div id="pixel-globe" />

            <h1 class="text-center bg-white dark:bg-dark">
                <TypedText>
                    &nbsp;Hello visitor!&nbsp;
                </TypedText>
            </h1>

            <h1 class="text-center bg-white dark:bg-dark">
                <TypedText offset={1.5}>
                    &nbsp;This is my portfolio.&nbsp;
                </TypedText>
            </h1>

            <div class="mt-20 animate-push">
                <svg style="scale: 5" class="fill-dark dark:fill-gray" xmlns="http://www.w3.org/2000/svg"
                    width="5" height="6" viewBox="0 0 5 6">
                    <title>Scroll down...</title>
                    <polygon points="5 3 5 4 4 4 4 5 3 5 3 6 2 6 2 5 1 5 1 4 0 4 0 3 2 3 2 0 3 0 3 3 5 3"
                        stroke-width="0" />
                </svg>
            </div>

            <div class="styling left-16 bottom-0 w-1 h-40 bg-gray dark:bg-darkgray" />
            <div class="styling left-5 bottom-8" style="writing-mode: tb-rl; transform: rotate(-180deg);">
                0.1 Welcome
            </div>
            <div class="styling left-16 bottom-40 w-4 h-4">
                <svg viewBox="0 0 16 16" stroke="none" xmlns="http://www.w3.org/2000/svg">
                    <title>design-circle</title>
                    <circle cx="8" cy="8" r="8" />
                </svg>
            </div>
        </section>

        <Chapter title="> About me" text={[
            <span>I am a {getAge()} year old Austrian computer scientist who <i>was</i> learning computer science at a higher technical highschool (HTL), but is currently employed.</span>,

            "Since 4th grade primary school I started making small games in the Unity engine. (of which I haven't finished a single one, but more about that later)",

            "Doing that was a lot of fun though and I realised this is exactly what I want to do in the future, so I decided to continue school at a technical highschool."
        ]} decoration={[
            <ChapterText text="0.2 About me" />,
            <VerticalLine />,
            <SVGCircle top={30} />,
            <SVGLine top={40} height={200} />,
            <DownArrow top={80} />
        ]} graphics={
            <ImageWithText image="img/home/Profile Picture.png" text={<span>this is me. More about the picture <A href="/book/about-me/my-profile-picture.md">here</A></span>} />
        } />

        <Chapter title="> School life" text={[
            <span>I ended up going to HTL <img src={theme() === "light" ? "/img/home/spengergasse-vector-logo.svg" : "/img/home/spengergasse-vector-logo-dark.svg"} alt="Spengergasse" class="inline h-6 align-text-top" />, located in Vienna's 5th district, Margareten.</span>,

            <span>Right from the start we were introduced to the basics of Java development. Because I already had experience with C# from making games, the first two years were very easy for me to follow. <i>(not that the rest was particularly hard to follow as well...)</i> </span>,

            "Aside from the programming lessons, we were also teached relational databases, computer hardware, and web development.",

            "After five years, in 2025, I eventually graduated with a Matura and was ready for the \"real life\"."
        ]} decoration={[
            <ChapterText text="0.3 School life" />,
            <VerticalLine />,
            <SVGCircle top={60} />,
            <SVGLine top={70} height={150} />,
            <DownArrow top={40} />
        ]} graphics={
            <ImageWithText image="img/home/Spengergasse GMaps.png" text="this is the highschool I have been visiting" />
        } />

        <section class="relative py-20 md:py-36 flex flex-col gap-5 justify-center items-center">
            <h1 class="text-center">
                ~ More about me <A href="/book/about-me/software-development.md">Here</A> ~
            </h1>

            <div class="styling left-16 top-0 w-1 h-28 bg-gray dark:bg-darkgray" />

            <SVGCircle class="top-28" />
        </section>
    </>
}

export default Home
