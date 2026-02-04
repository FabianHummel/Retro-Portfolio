import { A } from "@solidjs/router";
import { theme } from "@src/App";
import { type Component, For, type JSXElement, Show } from "solid-js";
import { Tag } from "../shared/Tag";

export interface ProjectItemProps {
    logo: string;
    darkLogo?: string;
    title: string;
    id: string;
    createDate: string;
    description: string[];
    bookLink?: string;
    links: Array<{ name: "github" | "demo" | "docs"; url: string }>;
    tags: string[];
    custom?: JSXElement | JSXElement[]
}

export const Project: Component<{ project: ProjectItemProps, decoration?: JSXElement[] }> = (props) => {

    const dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'long', day: '2-digit' });

    return (
        <section id={props.project.id} class="content grid grid-cols-[1fr] grid-rows-[auto,auto] md:gap-x-20 relative">
            {/* text */}
            <div class="row-start-1 mb-8">
                {/* title */}
                <img alt="Logo"
                    src={(theme() === "light" || !props.project.darkLogo) ? props.project.logo : props.project.darkLogo}
                    class="h-48 object-contain mx-auto" />

                {/* image */}
                {/* {props.project.image ?
					<img src={props.project.image} alt="Project image" />
				: null} */}

                {/* date */}
                <p class="row-start-2 align-top leading-normal">
                    {`Creation date: ${dateTimeFormat.format(new Date(props.project.createDate))}`}
                </p>

                {/* book link */}
                <Show when={props.project.bookLink}>
                    <div class="shiny-background">
                        <A href={`/book/${props.project.bookLink}`}>
                            <p>Read the book</p>
                        </A>
                    </div>
                </Show>
            </div>

            {/* description */}
            <div class="description flex flex-col gap-10">
                <For each={props.project.description}>
                    {(paragraph) => (
                        <p class="text-s"> {paragraph} </p>
                    )}
                </For>
            </div>

            {/* tags */}
            <div class="my-6 flex flex-row flex-wrap gap-y-4 items-center">
                <For each={props.project.tags}>
                    {(tag, index) => <>
                        <Tag tag={tag} />
                        {index() < props.project.tags.length - 1 &&
                            <div class="w-[6px] h-[6px] mx-4 bg-black dark:bg-gray" />
                        }
                    </>}
                </For>
                <div class="min-w-[14rem] ml-6 hidden md:grid grid-rows-[30px,0,30px] grid-cols-[2fr,1fr] flex-1 items-center">
                    <p class="col-span-2 text-s text-gray dark:text-darkgray row-start-1 leading-none">{
                        `${props.project.title} ... ${[...Array(10)].map(() => Math.round(Math.random())).join('')}`
                    }</p>
                    <div class="row-start-2 border-b-[3px] border-b-black" />
                    <div class="row-start-2 border-b-[3px] border-b-black border-dashed" />
                    <p class="col-span-2 text-s text-gray dark:text-darkgray row-start-3 text-right leading-none">
                        {`${"/".repeat(Math.random() * 5 + 3)}`}{props.project.links.map(link => {
                            return <>&nbsp<a class="hover:underline duration-100" href={link.url}>{link.name}</a></>
                        })}
                    </p>
                </div>
            </div>

            {/* extra styling */}
            <For each={props.decoration}>
                {(element) => (
                    element
                )}
            </For>

            {/* custom */}
            <For each={Array.of(props.project.custom).flat()}>
                {(element) => (
                    element
                )}
            </For>
        </section>
    )
}
