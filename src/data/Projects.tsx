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
            <p>Venture through foreign tales, research advanced technology, seek friendship with the unknown in the world of Sky's Horizon. You and your companion Chris stand up against the oppression of a leading institute in space exploration. However, the fight comes at high costs - Chris sacrifices his life for you to escape. Things get only worse from here after you unexpectedly crash on planet Sorax 4B, where you face extreme conditions and other dangers to look out for, so be prepared for an outrageous adventure.</p>,

            <p>Sky's Horizon is a first person story-told game with a focus on exploration and survival. The idea for this game has been in my head for many years now, but I never really got around to actually creating it until recently. For more in-depth information I really recommend reading the project's article <A href="/book/skys-horizon.md">here</A>.</p>
        ],
        links: [{
            name: "github",
            url: "https://github.com/FabianHummel/Minecraft-Skys-Horizon"
        }],
        tags: ["Minecraft", "Story", "Space exploration"]
    },

    {
        logo: "/img/projects/amethyst.png",
        title: "Amethyst",
        id: "amethyst",
        createDate: "2024-03-12",
        description: [
            <p>Amethyst is a modern, high-level compiled language for all your Minecraft datapack / resourcepack needs. It translates high level DSL code into Minecraft's command syntax, making it easier to write and maintain complex datapacks. Amethyst aims for optimal performance and great integration with existing Minecraft features.</p>,
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
            <p class="project-font">Heast Messenger is a decentralized, community-driven messenger service with high security standards in mind, written in .NET C#. We want to have the benefits of quickly writing a message to a relative, but also having a fun place to hang out with your gaming-friends - like Discord, but with privacy. Heast Messenger is not built to focus on one specific group of people, but rather being a place for everyone to connect with each other.</p>,

            <hr />,

            <p>The idea for this project came to me and a friend of mine when we were looking on how to create online networks in Java. We first thought of creating a multiplayer game, but then we decided to create a messenger service instead. We started with a simple JavaFX application, hooked it up with a MySQL database and started working on the backend, but quickly realized we need to switch to a more robust language like C#.</p>,
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
            <p class="project-font">Inspired by Twini-Golf by Polymars, this project is a work in progress Table Tennis game made in SDL3 C++. It features a minimal game style and it is possible to play against the computer locally or your friend across the internet. Custom game modes like fireball or hyperspeed spice up the gameplay and make it more fun to play (WIP).</p>,

            <hr />,

            <p>I used this project as a way to learn C++. Because I like hooking up the learning process with a simple project, I decided to start working on this minimalistic Table Tennis game. Later in the process, I added some trickier game mechanics and features such as a fairly customizable UI + animation engine and a pretty solid entity component system. At first, I was unsure whether to stick with C++ or switch to another language like Rust, because I honestly didn't like the way C++ is written, but I have changed my mind about that - I think C++ offers many great ways to express one's intentions, especially newer standards with better synatic sugar.</p>
        ],
        links: [{
            name: "github",
            url: "https://github.com/FabianHummel/CPP-TableTennis-Game"
        }],
        tags: ["C++", "SDL3"],
    },

    {
        logo: "/img/projects/a-sailors-tale.png",
        darkLogo: "/img/projects/a-sailors-tale-dark.png",
        title: "A Sailor's Tale",
        id: "a-sailors-tale",
        createDate: "2022-09-18",
        bookLink: "a-sailors-tale.md",
        description: [
            <p class="project-font">A Sailor's Tale is an adventorous retro game about a seemingly lonely sailor. Complete quests in a storyline-driven world full of fun things to explore.</p>,

            <hr />,

            <p>The idea for this game came to me not a long time ago - I only started working recently on it, when the motivation for other projects wasn't quite there. I've always wanted to make a game in that iconic <span class="font-main">~ retro-pokemon-like style ~</span>, I honestly find it absolutely gorgeous.</p>,

            <p>For this project I originally wanted to try out the Raylib game framework, but not with its native language C/C++, but rather with a more high-level language like C#. It's what I'm used to and it's what I need to create the more complex systems in my game (ai, quests, storyline, etc...)</p>
        ],
        links: [{
            name: "github",
            url: "https://github.com/FabianHummel/A-Sailors-Tale"
        }],
        tags: ["C#", "Raylib"]
    }
]

export default ProjectList;
