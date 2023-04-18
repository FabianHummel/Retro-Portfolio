import { Component, For, JSXElement } from "solid-js";
import { TypedText } from "../TypedText";
import { PixelImage } from "../PixelImage";

export interface ProjectItemProps {
	image?: string;
	title: string;
	createDate: string;
	description: string[];
	links: Array<{ name: "github" | "demo" | "docs"; url: string }>;
	tags: string[];
}

export const Project: Component<{ project: ProjectItemProps, decoration?: JSXElement[] }> = (props) => {

	let dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'long', day: '2-digit' });

	return (
		<section class="content grid grid-cols-[1fr] grid-rows-[auto,auto] md:gap-x-20">
			{/* text */}
			<div class="row-start-1 mb-8 grid grid-cols-[auto,auto] grid-rows-[auto,auto]">
				{/* title */}
				<h2 class="text-l">
					<TypedText onIntersect>
						{`> ${props.project.title}`}
					</TypedText>
				</h2>

				{/* image */}
				{/* {props.project.image ?
					<img src={props.project.image} alt="Project image" />
				: null} */}

				{/* date */}
				<p class="row-start-2 text-s pl-8 align-top leading-normal">
					{`Creation date: ${dateTimeFormat.format(new Date(props.project.createDate))}`}
				</p>
			</div>

			{/* description */}
			<div class="flex flex-col gap-10">
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
						<span class="text-s flex">
							<PixelImage src="img/projects/tags/tag-left.png" w={2} h={6} scale={5} />
							<p class="top-0 left-0 h-full bg-black text-white text-center leading-tight"> {tag} </p>
							<PixelImage src="img/projects/tags/tag-right.png" w={2} h={6} scale={5} />
						</span>
						{index() < props.project.tags.length - 1 &&
							<div class="w-[4px] h-[4px] mx-4 bg-black" />
						}
					</>}
				</For>
				<div class="h-[3px] flex-1 mx-4 bg-black hidden md:block" />
			</div>

			{/* extra styling */}
			<For each={props.decoration}>
				{(element) => (
					element
				)}
			</For>
		</section>
	)
}