import { ProjectItemProps } from "@components/projects/Project";

export function genHeight(): number {
	return Math.random() * 100 + 100
}

const ProjectList: Array<ProjectItemProps> = [
	{
		image: "img/projects/heast-messenger.png",
		title: "Heast Messenger",
		createDate: "2022-06-22",
		description: [
			"Heast Messenger is a community-driven messenger service with latest security standards in mind, written 100% in dotNET C#. We want to have the benefits of quickly writing a message to a relative, but also having a fun place to hang out with your gaming-friends. Heast Messenger is not built to focus on one specific group of people, but rather being a place for everyone to connect with each other.",

			"The idea for this project came to me and a friend of mine when we were looking on how to create online networks in Java. We first thought of creating a multiplayer game, but then we decided to create a messenger service instead. We started with a simple JavaFX application, hooked it up with a MySQL database and started working on the backend, but quickly realized we need to switch to a more robust language like C#.",
		],
		links: [{
			name: "github",
			url: "https://github.com/Heast-Messenger/Heast"
		}, {
			name: "docs",
			url: "https://heast.gitbook.io/docs/"
		}],
		tags: ["C#", "Avalonia", "DotNetty", "MySQL", "PostgreSQL", "Cassandra"]
	},

	{
		image: "img/projects/table-tennis.png",
		title: "Table Tennis",
		createDate: "2022-04-19",
		description: [
			"Inspired by Twini-Golf by Polymars, this project is a work in progress Table Tennis game made in SDL2 C++. It features a minimal game style and it is possible to play against the computer or your friend in a locally hosted game. Custom game modes like fireball or hyperspeed spice up the gameplay and make it more fun to play.",

			"I used this project as a way to learn C++. Because I like hooking up the learning process with a simple project, I decided to start working on this minimalistic Table Tennis game. I started with the basics of C++ and SDL2, then I added some basic game mechanics. I'm still unsure about whether I'll stick with C++ or rather switch to a more modern language like Rust, because I honestly don't like the way C++ is written."
		],
		links: [{
			name: "github",
			url: "https://github.com/FabianHummel/CPP-TableTennis-Game"
		}],
		tags: ["C++", "SDL2"]
	},

	{
		image: "img/projects/white-world.png",
		title: "A White World",
		createDate: "2022-09-18",
		description: [
			"A White World is an adventorous retro game about a seemingly lonely sailor. Complete quests in a storyline-driven world full of fun things to explore.",

			"The idea for this game came to me not a long time ago - I only started working recently on it, when the motivation for other projects wasn't quite there. I've always wanted to make a game in that iconic retro-pokemon-like style, I honestly find it absolutely gorgeous.",

			"For this project I originally wanted to try out the Raylib game framework, but not with its native language C/C++, but rather with a more high-level language like C#. It's what I'm used to and it's what I need to create the more complex systems in my game (ai, quests, storyline, etc...)"
		],
		links: [{
			name: "github",
			url: "https://github.com/FabianHummel/A-White-World"
		}],
		tags: ["C#", "Raylib"]
	},

	{
		image: "img/projects/skys-horizon.svg",
		title: "Sky's Horizon",
		createDate: "2022-06-25",
		description: [
			"Sky's Horizon features a unique, yet challenging storyline with unlimited, procedurally generated planets to explore, each with its own distinct materials and tons of new foreign flora and fauna. Right from the start you will be facing extreme conditions and other dangers to look out for, so prepare for an outrageous adventure.",

			"The first ideas I had for this game were a few years ago, but I never really got around to actually making it. It's a first person story-told game with a focus on exploration and survival. I was unsure about whether I make it in Unity or Minecraft, but I decided to go with vanilla Minecraft because I have lots of experience with datapack development. For the actual coding I use Sandstone, a TypeScript framework that helps me with the development process.",
		],
		links: [{
			name: "github",
			url: "https://github.com/FabianHummel/Minecraft-Skys-Horizon"
		}],
		tags: ["Minecraft", "Sandstone", "Datapacks"]
	},
]

export default ProjectList;