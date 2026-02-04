import { Component, createSignal, For, onCleanup, onMount } from "solid-js";
import { TypedText } from "@components/shared/TypedText";
import { Tag } from "@components/shared/Tag";
import { PixelImage } from "@components/shared/PixelImage";
import { theme } from "@src/App";

const username = "FabianHummel";
const endpoint = "https://api.github.com/users";
const closeFriendsNames = ["m-ue-d", "KonradSimlinger", "Gipfel", "PulecChristian", "atomeniuc"];

const lastUpdated = new Date(window.localStorage.getItem("github-last-updated"));

if (lastUpdated && new Date().getTime() - lastUpdated.getTime() < 1000 * 60 * 60) {
    console.log("Using cached data.");
    var userCache = JSON.parse(window.localStorage.getItem("github-user")!);
    var reposCache = JSON.parse(window.localStorage.getItem("github-repos")!);
    var friendsCache = JSON.parse(window.localStorage.getItem("github-friends")!);
    var starredCache = JSON.parse(window.localStorage.getItem("github-starred")!);
} else {
    console.log("Fetching new data.");
    window.localStorage.setItem("github-last-updated", new Date().toISOString());
}

async function fetchUser() {
    const response = await fetch(`${endpoint}/${username}`);
    const data = await response.json();
    window.localStorage.setItem("github-user", JSON.stringify(data));
    return data;
}

async function fetchRepos() {
    const response = await fetch(`${endpoint}/${username}/repos`);
    const data = await response.json();
    window.localStorage.setItem("github-repos", JSON.stringify(data));
    return data;
}

async function fetchFriends() {
    const response = await fetch(`${endpoint}/${username}/following`);
    const data = await response.json();
    window.localStorage.setItem("github-friends", JSON.stringify(data));
    return data;
}

async function fetchStarred() {
    const response = await fetch(`${endpoint}/${username}/starred`);
    const data = await response.json();
    window.localStorage.setItem("github-starred", JSON.stringify(data));
    return data;
}

let user = userCache || await fetchUser();
let repos = reposCache || await fetchRepos();
repos = repos.filter(r => !r.fork);
let friends = friendsCache || await fetchFriends();
let starred = starredCache || await fetchStarred();

let closeFriends = friends.filter((f: any) => closeFriendsNames.includes(f.login));

const Github: Component = () => {
    let repositoryContainerRef!: HTMLDivElement;

    const [repositoryContainerWidth, setRepositoryContainerWidth] = createSignal(0);

    onMount(() => {
        const resizeObserver = new ResizeObserver(() => {
            setRepositoryContainerWidth(repositoryContainerRef.offsetWidth);
        });

        resizeObserver.observe(repositoryContainerRef);

        onCleanup(() => {
            resizeObserver.disconnect();
        })
    })

    return <>
        <section class="relative pt-52 pb-36 flex flex-col gap-5 justify-center items-center">
            <h1 class="title">
                <TypedText children="My Github Repositories" />
            </h1>

            <p class="title">
                My entire heart and soul, together, <br /> in one central place.
            </p>
        </section>

        <section id="github-section" class="relative block lg:grid p-12 lg:p-36 pt-0 md:pr-24 gap-16">
            <div class="block lg:sticky top-[200px] font-main">
                <div class="relative w-full aspect-square mb-8 mx-auto max-w-xs lg:max-w-none">
                    <div class="absolute w-full h-full stroke-gray">
                        <svg class="animate-spin" viewBox="0 0 256 256" fill="none" overflow="visible"
                            xmlns="http://www.w3.org/2000/svg">
                            <circle cx="128" cy="128" r="128" stroke-width="6" stroke-dasharray="16 15" />
                        </svg>
                    </div>
                    <div class="absolute inset-4 bg-cover bg-center rounded-full" style={
                        `background-image: url(${user.avatar_url});`
                    } />
                </div>

                <p class="-rotate-3 text-center">~ {user.bio}</p>

                <a href={user.html_url}>
                    <h1 class="mt-14"><TypedText>Fabian Hummel</TypedText></h1>
                    <p class="text-gray">@{user.login}</p>
                </a>

                <h1 class="mt-14 mb-4"><TypedText>Close friends</TypedText></h1>
                <ul class="flex flex-col gap-4 m-0 p-0 mb-16">
                    <For each={closeFriends}>
                        {(friend) => {
                            return (
                                <a href={friend.html_url}>
                                    <li class="flex items-center m-0 p-0">
                                        <img src={friend.avatar_url} alt={friend.login}
                                            class="w-10 h-10 rounded-full" />
                                        <p class="ml-4">{friend.login}</p>
                                    </li>
                                </a>
                            )
                        }}
                    </For>
                </ul>
            </div>

            <div ref={repositoryContainerRef} style="grid-area: repositories;">
                <h1 class="mb-16">
                    <span class="text-gray">{'-='.repeat(repositoryContainerWidth() / 30 / 100 * 10)}</span>
                    <span> My Repositories </span>
                    <span class="text-gray">{'=-'.repeat(repositoryContainerWidth() / 30 / 100 * 25)}</span>
                </h1>

                <div class="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(500px,1fr))]">
                    <For each={repos}>
                        {(repo) => (
                            <div class="w-full github-repository" style={`border-image-source: url('${theme() === "light" ? "/img/github/Repository Background.png" : "/img/github/Repository Background Dark.png"
                                }');`}>
                                <button title="Copy clone link" class="absolute top-4 right-4" onClick={() => {
                                    navigator.clipboard.writeText(repo.ssh_url);
                                    alert("Copied to clipboard!");
                                }}><PixelImage src={"/img/github/Clone.png"} darkSrc={"/img/github/Clone Dark.png"} w={5} h={5} scale={3} /></button>
                                <h2 class="underline"><a href={repo.html_url}>{repo.name}</a></h2>
                                <p>{repo.description}</p>
                                <div hidden={!repo.language} class="items-start flex flex-col mt-4">
                                    <Tag tag={repo.language} />
                                </div>
                            </div>
                        )}
                    </For>
                </div>
            </div>
        </section>
    </>
}

export default Github
