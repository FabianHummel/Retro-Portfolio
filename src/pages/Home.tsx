import { Component } from "solid-js";
import { FullPage } from "../components/home/FullPage";
import { Graphics } from "../components/home/Graphics";
import { ChapterText, DownArrow, SVGCircle, SVGLine, VerticalLine } from "../components/Styling";
import { PixelImage } from "../components/PixelImage";
import { TypedText } from "../components/TypedText";

const Home: Component = () => {
	return <>
		<section class="relative h-screen flex flex-col justify-center items-center">
			<h1 class="font-main text-l">
				<TypedText>
					Hello visitor!
				</TypedText>
			</h1>

			<h1 class="font-main text-l">
				<TypedText offset={1.5}>
					This is my portfolio.
				</TypedText>
			</h1>

			<div class="mt-20 animate-push dark:invert">
				<PixelImage src="img/Continue.png" w={5} h={6} scale={5} alt="Continue" />
			</div>

			<div class="absolute left-16 bottom-0 w-1 h-40 bg-gray -translate-x-1/2" />
			<div class="absolute left-5 bottom-8 text-gray text-s" style={`writing-mode: tb-rl; transform: rotate(-180deg);`}>
				0.1 Welcome
			</div>
			<div class={`absolute left-16 bottom-40 w-4 h-4 fill-gray -translate-x-1/2`}>
				<svg viewBox="0 0 16 16" stroke="none" xmlns="http://www.w3.org/2000/svg">
					<circle cx="8" cy="8" r="8" />
				</svg>
			</div>
		</section>

		<FullPage title="> About me" text={[
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

		<FullPage title="> School life" text={[
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

		<section class="relative py-36 flex flex-col gap-5 justify-center items-center">
			<h1 class="font-main text-l">
				~ Stories about my career ~
			</h1>

			<p class="font-main text-s">
				Read them in my blog!
			</p>

			<div class="absolute left-16 top-0 w-1 h-28 bg-gray -translate-x-1/2" />

			<div class={`absolute left-16 top-28 w-4 h-4 fill-gray -translate-x-1/2`}>
				<svg viewBox="0 0 16 16" stroke="none" xmlns="http://www.w3.org/2000/svg">
					<circle cx="8" cy="8" r="8" />
				</svg>
			</div>
		</section>
	</>
}

export default Home