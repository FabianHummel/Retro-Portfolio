import { Graphics } from "@components/home/Graphics";
import { Chapter } from "@components/shared/Chapter";
import { ChapterText, DownArrow, SVGCircle, SVGLine, VerticalLine } from "@components/shared/Styling";
import { TypedText } from "@components/shared/TypedText";
import type { Component } from "solid-js";

const Home: Component = () => {
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
            "I am a 16 year old austrian student learning computer science in a higher technical college.",

            "since 4th grade primary school I started making small games in the Unity engine. (of which I haven`t finished a single one, but more about that later)",

            "doing that was a lot of fun though and I realised this is exactly what I want to do in the future, so I decided to continue school at a technical college."
        ]} decoration={[
            <ChapterText text="0.2 About me" />,
            <VerticalLine />,
            <SVGCircle top={30} />,
            <SVGLine top={40} height={200} />,
            <DownArrow top={80} />
        ]} graphics={
            <Graphics image="img/home/Profile Picture.png" text="this is my logo, you will learn about it a little later" />
        } />

        <Chapter title="> School life" text={[
            "I ended up going to HTL Spengergasse, located in the 5th district of Vienna.",

            "Right from the start we were introduced to the basics of Java development. Because I already had experience with C# from making games, the first two years were very easy for me to follow.",

            "Aside from the programming lessons, we were also teached relational databases, computer hardware, and web development."
        ]} decoration={[
            <ChapterText text="0.3 School life" />,
            <VerticalLine />,
            <SVGCircle top={60} />,
            <SVGLine top={70} height={150} />,
            <DownArrow top={40} />
        ]} graphics={
            <Graphics image="img/home/Spengergasse GMaps.png" text="this is the college I'm currently visiting" />
        } />

        <section class="relative py-20 md:py-36 flex flex-col gap-5 justify-center items-center">
            <h1 class="text-center">
                ~ More about me ~
            </h1>

            <div class="styling left-16 top-0 w-1 h-28 bg-gray dark:bg-darkgray" />

            <SVGCircle class="top-28" />

            <div class="styling left-16 bottom-0 w-1 h-28 bg-gray dark:bg-darkgray" />

            <SVGCircle class="bottom-28" />
        </section>

        <Chapter title="My approach to learning new things" text={[
            "During the last few years I have created several projects and tried something new with each of them. When learning a new language for example, I always try to build something small around it to train practical use right from the start.",

            "When I get to create the project, I often already have a rough idea what of what I want it to be about. It's then only up to planning and writing the code. If my motivation is high enough, I will finish the project, but if not, I will just leave it as it is and move on to the next project - even though I am not proud of that.",
        ]} decoration={[
            <ChapterText text="0.4 Learning" />,
            <VerticalLine />,
            <SVGCircle top={90} />,
            <SVGLine top={30} height={170} />,
            <DownArrow top={5} />
        ]} />

        <Chapter title="How I got to (web)design" text={[
            "It all started with my first few WMC (web & mobile computing) classes in first grade of college. According to my teacher, we are only supposed to learn HTML and some CSS layout properties so we could make proper functional websites...",

            "But I was never happy with handing over \"unfinished looking\" websites for my assignments. It was that moment when I started looking at webdesigners' portfolios and ideas. I read through modern UI pricinciples and how to make well structured, good looking user interfaces. This helped me a lot in understanding how the design affects the user experience and that it's important to make the consumer feel comfortable with the product.",
        ]} decoration={[
            <ChapterText text="0.5 Design" />,
            <VerticalLine />,
            <SVGCircle top={30} />,
            <SVGLine top={40} height={200} />,
            <DownArrow top={80} />
        ]} />

        <Chapter title="About my portfolio" text={[
            "I am talking about the website you are currently on, obviously. This isn't my first portfolio, but it's the first one I'm actually kinda proud of. I tried a lot of different ideas and layouts, but none of them felt right. Sometimes I would get stuck on a single page for days, trying to make it look good or having to deal with the struggles of making it responsive.",

            "Eventually, I decided to go with a simple, minimalistic design based on my (not anywhere near finished) game. As you can see, i went with a black-and-white theme that absolutely destroys your eyes if you look at it for too long - I'm sorry...",

            "For the nerds out there: I made this website using Solid.JS and TailwindCSS. Yes, I refuse to use React! The full source code is available on my GitHub page."
        ]} decoration={[
            <ChapterText text="0.6 Portfolio" />,
            <VerticalLine />,
            <SVGCircle top={30} />,
            <SVGLine top={40} height={200} />,
            <DownArrow top={90} />
        ]} />

        <Chapter title="The profile picture" text={[
            "If we remind ourselves of the design chapter from before, you might remember that I learned a lot about UI design. Well, making user interfaces isn't the only thing I started doing. Experimenting with illustrations and logos is also something I enjoy doing ever since.",

            "So I started making my own avatars. And boy, did I make a lot of them. They got simpler and simpler over time, but not in a bad way. The latest version of it is the one you see on the top of this page.",

            "Dragons. Those majestic creatures have always been my favorite. I love their shape, I can let my creativity run wild with them. My latest one is actually based on the logo from LLVM, the compiler framework for the C family and other languages."
        ]} decoration={[
            <ChapterText text="0.7 My avatar" />,
            <VerticalLine />,
            <SVGCircle top={80} />,
            <SVGLine top={30} height={200} />,
            <DownArrow top={30} />
        ]} />
    </>
}

export default Home
