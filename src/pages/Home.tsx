import { ImageWithText } from "@components/home/Graphics";
import { Chapter } from "@components/shared/Chapter";
import { PixelImage } from "@components/shared/PixelImage";
import { ChapterText, DownArrow, SVGCircle, SVGLine, VerticalLine } from "@components/shared/Styling";
import { TypedText } from "@components/shared/TypedText";
import { A } from "@solidjs/router";
import { theme } from "@src/App";
import { Component, createEffect, createMemo, createSignal, onCleanup, onMount } from "solid-js";
import homeStyle from "@components/home/style.css?inline";
import { createMousePosition } from "@solid-primitives/mouse";
import AustriaFlag from "@components/home/AustriaFlag";

const Home: Component = () => {

    const pos = createMousePosition(window, {
        touch: false
    });

    window.addEventListener("deviceorientation", (event) => {
        setDepthX(event.gamma / 4.0);
        setDepthY(event.beta / 10.0);
    });

    function sineSmoothstep(x) {
        if (x <= -1) return -1;
        if (x >= 1) return 1;
        return Math.sin((Math.PI / 2) * x);
    }

    const DEPTH_FACTOR = 5;

    createEffect(() => {
        setDepthX(DEPTH_FACTOR * (sineSmoothstep(pos.x / window.innerWidth * 2 - 1)));
    });

    createEffect(() => {
        setDepthY(DEPTH_FACTOR * (sineSmoothstep((pos.y - window.scrollY) / window.innerHeight) * 2 - 1));
    });

    const [depthX, setDepthX] = createSignal(0.0);
    const [depthY, setDepthY] = createSignal(0.0);

    function getAge() {
        var today = new Date();
        var birthDate = new Date("2006-08-21T00:00:00");
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    function scrollToHeading() {
        window.scrollTo({ top: 830, behavior: "smooth" });
    }

    return <>
        <style>{homeStyle}</style>

        <section id="home-section" class="relative flex flex-col md:justify-center items-start pl-10 lg:pl-40 pt-20 md:pt-52">
            <div id="background-images" style={{
                "--offset-x": depthX() + "px",
                "--offset-y": depthY() + "px",
            }} />

            <h1 class="bg-white dark:bg-dark pr-4 max-md:pl-4 md:-mt-64 text-5xl! lg:text-7xl!">
                <TypedText>
                    Hello visitor!
                </TypedText>
            </h1>

            <h1 class="bg-white dark:bg-dark pr-4 max-md:pl-4 text-2xl! lg:text-4xl!">
                <TypedText offset={1.5}>
                    This is my portfolio.
                </TypedText>
            </h1>

            <div class="md:hidden flex-1" />

            <h1 class="bg-white dark:bg-dark text-2xl! lg:text-3xl! md:mt-40 pr-4 max-md:pl-4 max-md:self-center">Scroll down to learn</h1>
            <h1 class="bg-white dark:bg-dark text-2xl! lg:text-3xl! pr-4 max-md:pl-4 max-md:self-center">more about me!</h1>

            <button type="button" class="bg-white dark:bg-dark w-14 h-14 grid place-content-center max-md:mb-40 md:ml-10 mt-10 animate-push cursor-pointer max-md:self-center" onClick={scrollToHeading}>
                <svg style="scale: 5" class="fill-dark dark:fill-gray" xmlns="http://www.w3.org/2000/svg"
                    width="5" height="6" viewBox="0 0 5 6">
                    <title>Scroll down...</title>
                    <polygon points="5 3 5 4 4 4 4 5 3 5 3 6 2 6 2 5 1 5 1 4 0 4 0 3 2 3 2 0 3 0 3 3 5 3"
                        stroke-width="0" />
                </svg>
            </button>

            <VerticalLine class="h-44! bottom-10" />
            <ChapterText class="bottom-20">0.1 Welcome</ChapterText>
            <SVGLine class="bottom-20" height={100} />
            <SVGCircle class="bottom-52" />
            <SVGCircle class="bottom-10" />
            <DownArrow class="bottom-20" />
        </section>

        <Chapter title="> About me" text={[
            <p>Hi there! Let me introduce myself: I am a {getAge()} year old <AustriaFlag /> Austrian who learnt computer science at a higher technical highschool (HTL) and is currently employed as a fulltime software engineer. <i>Occasionally I'm also something inbetween a cute fox, wolf or hyena :3</i></p>,

            <p>Since 4th grade primary school I started making small games in the Unity engine <i>(of which I haven't finished a single one, but more about that <A href="/book/unity-games.md">here</A>...)</i>. I try to experiment with many different things in my free-time, mostly software, but occasionally even arts and crafts - <i>whatever motivates me ;)</i></p>,

            "Making silly mobile games was a lot of fun though and I realised this is exactly what I want to do in the future, so I decided to continue school at a technical school (HTL)."
        ]} decoration={[
            <ChapterText class="top-20">0.2 About me</ChapterText>,
            <VerticalLine />,
            <SVGCircle top={30} />,
            <SVGLine top={40} height={200} />,
            <DownArrow top={80} />
        ]} graphics={
            <ImageWithText image="img/home/Bumble.jpg" text={<span>This is me! More about the picture <A href="/book/about-me/my-profile-picture.md">here</A> ^<span class="after:animate-eye" />.0<span class="after:animate-ear" /></span>} />
        } />

        <Chapter flipped title="> School life" text={[
            <span>I ended up going to HTL <img src={theme() === "light" ? "/img/home/spengergasse-vector-logo.svg" : "/img/home/spengergasse-vector-logo-dark.svg"} alt="Spengergasse" class="inline h-6 align-text-top" />, located in Vienna's 5th district, Margareten.</span>,

            <span>Right from the start we were introduced to the basics of Java development. Because I already had experience with C# from making games, the first two years were very easy for me to follow. <i>(not that the rest was particularly hard to follow as well...)</i> </span>,

            <p>Aside from the programming lessons, we were also teached relational databases, computer hardware, and web development as well! Read more upon that <A href="/book/about-me/(web)-design.md">here</A>!</p>,

            "After five years, in 2025, I eventually graduated with a Matura and was ready for the \"real life\"."
        ]} decoration={[
            <ChapterText class="top-20">0.3 School life</ChapterText>,
            <VerticalLine />,
            <SVGCircle top={60} />,
            <SVGLine top={70} height={150} />,
            <DownArrow top={40} />,
            <SVGCircle top={60} />,
        ]} graphics={
            <ImageWithText image="img/home/HTL_Spengergasse_Eingang.jpg" text="this is the HTL I was visiting from 2020-2025" />
        } />

        <Chapter title="> Employment" text={[
            <span>During the summer holidays of my last two years at Spengergasse, I had the opportunity to complete an internship for two months at <img src="/img/home/Erste Digital.png" alt="Erste Digital" class="inline h-6 align-text-top rounded-md ml-1" /> (Erste Digital), the tech-division of Austria's biggest bank - <img src="/img/home/Erste Bank.png" alt="Erste Bank" class="inline h-6 align-text-top" /> Erste Bank.</span>,

            <span>I really liked it there - the location was very convenient (right next to the main train station), my colleagues were all super friendly and I could genuinely imagine myself working there for a longer period of time - <i>maybe not for the rest of my life,</i> but definitely the upcoming few years!</span>,

            "After finishing the matura I contacted my previous boss and he eventually got me a full-time position in a different department, which I am very grateful for, as it secured an essential part of my adulthood."
        ]} decoration={[
            <ChapterText class="top-40">0.4 Employment</ChapterText>,
            <VerticalLine />,
            <SVGCircle top={60} />,
            <SVGLine top={70} height={120} />,
            <SVGLine top={10} height={70} />,
            <DownArrow top={20} />,
            <SVGCircle top={60} />,
        ]} graphics={
            <ImageWithText image="img/home/Erste_Campus_Vienna.jpg" text="a lovely view of the Erste-Campus!" />
        } />

        <section class="relative py-20 md:py-36 flex flex-col gap-5 justify-center items-center">
            <h1 class="text-center">
                ~ More about me in<br class="block md:hidden" /> <A href="/book/about-me.md">my book!</A>&nbsp;
                <A href="/book/about-me.md">
                    <PixelImage class="inline" src="img/Book.png" darkSrc="img/Book Dark.png" w={12} h={12} scale={3} />
                </A> ~
            </h1>

            <VerticalLine class="top-20 h-28!" />
            <SVGCircle class="top-16" />
            <SVGCircle class="top-44" />
        </section>
    </>
}

export default Home
