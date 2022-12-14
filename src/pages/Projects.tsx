import { Component } from "solid-js";
import { Chapter } from "../components/Chapter";
import { ChapterText, DownArrow, SVGCircle, SVGLine, VerticalLine } from "../components/Styling";
import { TypedText } from "../components/TypedText";

const Projects: Component = () => {
	return <>
		<section class="relative pt-52 pb-36 flex flex-col gap-5 justify-center items-center">
			<h1 class="title text-l">
				<TypedText>
					My personal projects
				</TypedText>
			</h1>

			<p class="title text-s max-w-lg">
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

		<Chapter title="> Sky's Horizon" text={[
			"Sky's Horizon features a unique, yet challenging storyline with unlimited, procedurally generated planets to explore, each with its own distinct materials and tons of new foreign flora and fauna. Right from the start you will be facing extreme conditions and other dangers to look out for, so prepare for an outrageous adventure.",

			"The first ideas I had for this game were a few years ago, but I never really got around to actually making it. It's a first person story-told game with a focus on exploration and survival. I was unsure about whether I make it in Unity or Minecraft, but I decided to go with vanilla Minecraft because I have lots of experience with datapack development. For the actual coding I use Sandstone, a TypeScript framework that helps me with the development process.",
		]} decoration={[
			<ChapterText text="0.2 Sky's Horizon" />,
			<VerticalLine />,
			<SVGCircle top={30} />,
			<SVGLine top={40} height={200} />,
			<DownArrow top={80} />
		]} />

		<Chapter title="> Heast Messenger" text={[
			"Heast Messenger is a community-driven messenger service with latest security standards in mind, written 100% in Java and Kotlin. We want to have the benefits of quickly writing a message to a relative, but also having a fun place to hang out with your gaming-friends. Heast Messenger is not built to focus on one specific group of people, but rather being a place for everyone to connect with each other.",

			"The idea for this project came to me and a friend of mine when we were looking on how to create online networks in Java. We first thought of creating a multiplayer game, but then we decided to create a messenger service instead. We started with a simple JavaFX application, hooked it up with a MySQL database and started working on the backend."
		]} decoration={[
			<ChapterText text="0.3 Heast Messenger" />,
			<VerticalLine />,
			<SVGCircle top={60} />,
			<SVGLine top={70} height={150} />,
			<DownArrow top={40} />,
		]} />

		<Chapter title="> Table Tennis" text={[
			"Inspired by Twini-Golf by Polymars, this project is a work in progress Table Tennis game made in SDL2 C++. It features a minimal game style and it is possible to play against the computer or your friend in a locally hosted game. Custom game modes like fireball or hyperspeed spice up the gameplay and make it more fun to play.",

			"I used this project as a way to learn C++. Because I like hooking up the learning process with a simple project, I decided to start working on this minimalistic Table Tennis game. I started with the basics of C++ and SDL2, then I added some basic game mechanics. I'm still unsure about whether I'll stick with C++ or rather switch to a more modern language like Rust, because I honestly don't like the way C++ is written."
		]} decoration={[
			<ChapterText text="0.4 Table Tennis" />,
			<VerticalLine />,
			<SVGCircle top={40} />,
			<SVGLine top={60} height={130} />,
			<DownArrow top={50} />,
		]} />

		<Chapter title="~ White World ~" text={[
			"A White World is an adventorous retro game about a seemingly lonely seaman. Complete quests in a storyline-driven world full of fun things to explore.",

			"The idea for this game came to me not a long time ago - I only started working recently on it, when the motivation for other projects wasn't quite there. I've always wanted to make a game in that iconic retro-pokemon-like style, I honestly find it absolutely gorgeous.",

			"For this project I originally wanted to try out the Raylib game framework, but not with its native language C/C++, but rather with a more high-level language like C#. It's what I'm used to and it's what I need to create the more complex systems in my game (ai, quests, storyline, etc...)"
		]} decoration={[
			<ChapterText text="0.5 White World" />,
			<VerticalLine />,
			<SVGCircle top={30} />,
			<SVGLine top={40} height={200} />,
			<DownArrow top={80} />,
		]} />
	</>
}

export default Projects;