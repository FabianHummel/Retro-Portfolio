import type { ProjectItemProps } from "@components/projects/Project";
import { A } from "@solidjs/router";

export function genHeight(): number {
    return Math.random() * 100 + 100
}

const ProjectList: () => Array<ProjectItemProps> = () => [
    {
        logo: "/img/projects/skys-horizon.png",
        darkLogo: "/img/projects/skys-horizon-dark.png",
        title: "Sky's Horizon",
        id: "skys-horizon",
        createDate: "2022-06-25",
        bookLink: "skys-horizon.md",
        description: [
            "Venture through foreign tales, research advanced technology, seek friendship with the unknown in the world of Sky's Horizon. You and your companion Chris stand up against the oppression of a leading institute in space exploration. However, the fight comes at high costs - Chris sacrifices his life for you to escape. Things get only worse from here after you unexpectedly crash on planet Sorax 4B, where you face extreme conditions and other dangers to look out for, so be prepared for an outrageous adventure.",

            <span>Sky's Horizon is a first person story-told game with a focus on exploration and survival. The idea for this game has been in my head for many years now, but I never really got around to actually creating it. For more in-depth information I really recommend reading the article <A href="/book/skys-horizon.md">here</A>.</span>
        ],
        links: [{
            name: "github",
            url: "https://github.com/FabianHummel/Minecraft-Skys-Horizon"
        }],
        tags: ["Godot"]
    },

    {
        logo: "/img/projects/amethyst.png",
        title: "Amethyst",
        id: "amethyst",
        createDate: "2024-03-12",
        description: [
            "Amethyst is a modern, high-level compiled language for all your Minecraft datapack / resourcepack needs. It translates high level DSL code into Minecraft's command syntax, making it easier to write and maintain complex datapacks. Amethyst aims for optimal performance and great integration with existing Minecraft features.",
        ],
        links: [{
            name: "github",
            url: "https://github.com/FabianHummel/Amethyst-Compiler"
        }],
        tags: ["C#", "ANTLR", "Minecraft"]
    },

    {
        logo: "/img/projects/heast-messenger.png",
        title: "Heast Messenger",
        id: "heast-messenger",
        createDate: "2022-06-22",
        bookLink: "heast-messenger.md",
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
        tags: ["C#", "Avalonia", "DotNetty", "MySQL", "PostgreSQL"],
        custom: [
            <img alt="Heast-Hummel" src="/img/projects/heast-icon.png" class="absolute -z-10 rotate-6 w-[200px] xl:w-[400px] top-8 xl:-top-20 right-8 invisible md:visible" />
        ]
    },

    {
        logo: "/img/projects/table-tennis.png",
        title: "Table Tennis",
        id: "table-tennis",
        createDate: "2022-04-19",
        bookLink: "table-tennis.md",
        description: [
            "Inspired by Twini-Golf by Polymars, this project is a work in progress Table Tennis game made in SDL2 C++. It features a minimal game style and it is possible to play against the computer or your friend in a locally hosted game. Custom game modes like fireball or hyperspeed spice up the gameplay and make it more fun to play.",

            "I used this project as a way to learn C++. Because I like hooking up the learning process with a simple project, I decided to start working on this minimalistic Table Tennis game. I started with the basics of C++ and SDL2, then I added some basic game mechanics. I'm still unsure about whether I'll stick with C++ or rather switch to a more modern language like Rust, because I honestly don't like the way C++ is written."
        ],
        links: [{
            name: "github",
            url: "https://github.com/FabianHummel/CPP-TableTennis-Game"
        }],
        tags: ["C++", "SDL2"],
    },

    {
        logo: "/img/projects/a-sailors-tale.png",
        darkLogo: "/img/projects/a-sailors-tale-dark.png",
        title: "A Sailor's Tale",
        id: "a-sailors-tale",
        createDate: "2022-09-18",
        bookLink: "a-sailors-tale.md",
        description: [
            "A Sailor's Tale is an adventorous retro game about a seemingly lonely sailor. Complete quests in a storyline-driven world full of fun things to explore.",

            "The idea for this game came to me not a long time ago - I only started working recently on it, when the motivation for other projects wasn't quite there. I've always wanted to make a game in that iconic retro-pokemon-like style, I honestly find it absolutely gorgeous.",

            "For this project I originally wanted to try out the Raylib game framework, but not with its native language C/C++, but rather with a more high-level language like C#. It's what I'm used to and it's what I need to create the more complex systems in my game (ai, quests, storyline, etc...)"
        ],
        links: [{
            name: "github",
            url: "https://github.com/FabianHummel/A-Sailors-Tale"
        }],
        tags: ["C#", "Raylib"]
    }
]

export default ProjectList;
