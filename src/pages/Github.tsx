import {Component, createSignal, For, onCleanup, onMount} from "solid-js";
import {TypedText} from "@components/shared/TypedText";
import {Tag} from "@components/shared/Tag";
import {PixelImage} from "@components/shared/PixelImage";

const username = "FabianHummel";
const endpoint = "https://api.github.com/users";

async function fetchUser(name: string) {
    const response = await fetch(`${endpoint}/${name}`);
    return await response.json();
}

async function fetchRepos() {
    const response = await fetch(`${endpoint}/${username}/repos`);
    return await response.json();
}

async function fetchFriends() {
    const response = await fetch(`${endpoint}/${username}/following`);
    return await response.json();
}

async function fetchStarred() {
    const response = await fetch(`${endpoint}/${username}/starred`);
    return await response.json();
}

let user = await fetchUser(username);
let repos = await fetchRepos();
repos = repos.filter(r => !r.fork);
let friends = await fetchFriends();
let starred = await fetchStarred();

const closeFriends = await Promise.all(["m-ue-d", "lambdaspg", "atomeniuc", "gipfel"].map(async f => await fetchUser(f)));

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

        <section id="github-section" class="relative p-36 pt-0 md:pr-24 gap-16">
            <div class="sticky top-[200px]">
                <div class="relative w-full aspect-square mb-8">
                    <div class="absolute w-full h-full stroke-gray">
                        <svg class="animate-spin" viewBox="0 0 256 256" fill="none" overflow="visible"
                             xmlns="http://www.w3.org/2000/svg">
                            <circle cx="128" cy="128" r="128" stroke-width="6" stroke-dasharray="16 15"/>
                        </svg>
                    </div>
                    <div class="absolute inset-4 bg-cover bg-center rounded-full" style={
                        `background-image: url(${user.avatar_url});`
                    }/>
                </div>

                <p class="-rotate-3 text-center">~ {user.bio}</p>

                <a href={user.html_url}>
                    <h1 class="mt-14"><TypedText>Fabian Hummel</TypedText></h1>
                    <p class="text-gray">@{user.login}</p>
                </a>

                <h1 class="mt-14 mb-4"><TypedText>Close friends</TypedText></h1>
                <ul class="flex flex-col gap-4 m-0 p-0">
                    <For each={closeFriends}>
                        {(friend) => {
                            return (
                                <a href={friend.html_url}>
                                    <li class="flex items-center m-0 p-0">
                                        <img src={friend.avatar_url} alt={friend.login}
                                             class="w-10 h-10 rounded-full"/>
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

                <div class="flex flex-wrap gap-8">
                    <For each={repos}>
                        {(repo) => (
                            <div class="github-repository">
                                <button title="Copy clone link" class="absolute top-4 right-4" onClick={() => {
                                    navigator.clipboard.writeText(repo.ssh_url);
                                    alert("Copied to clipboard!");
                                }}><PixelImage src={"/img/github/Clone.png"} w={5} h={5} scale={3}/></button>
                                <h2 class="underline"><a href={repo.html_url}>{repo.name}</a></h2>
                                <p>{repo.description}</p>
                                <div hidden={!repo.language} class="items-start flex flex-col mt-4">
                                    <Tag tag={repo.language}/>
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
