import { PixelImage } from "@components/shared/PixelImage";
import { Link } from "@solidjs/router";
import {Component, Show, createSignal, onMount, createEffect} from "solid-js";
import {articles, Entry as EntryData, openedArticleIndex} from "@pages/Book";
import {Entries} from "@solid-primitives/keyed";

export const Entry: Component<{
	title: string,
	entry: EntryData,
	index: number,
}> = (props) => {

	const [open, setOpen] = createSignal(false);

	onMount(() => {
		setOpen(window.localStorage.getItem("book:" + props.entry.path) === "true");
	});

	createEffect(() => {
		window.localStorage.setItem("book:" + props.entry.path, open() ? "true" : "false");
	});

	return (
		<div class="text-m ml-3 border-l-[3px] border-l-gray dark:border-l-darkgray">
			{props.entry.path
				? <>
					<div class="flex justify-between items-center gap-2 pl-3" classList={{
						"bg-light dark:bg-black": articles[openedArticleIndex()].path === props.entry.path,
					}}>
						<Link href={`/book/${props.entry.path}`} class={"flex-1"}>
							<header class="text-black dark:text-gray" onClick={() => {
								setOpen(true);
							}}>
								{props.title}
							</header>
						</Link>
						{props.entry.children &&
							<div class={"p-2 cursor-pointer"}>
								<PixelImage src={
									open()
										? "/img/book/Retract.png"
										: "/img/book/Expand.png"}
											darkSrc={
												open()
													? "/img/book/Retract Dark.png"
													: "/img/book/Expand Dark.png"
											}
											alt="Open/Close Section" w={5} h={5} scale={3} onClick={() =>
									setOpen(!open())} />
							</div>
						}
					</div>
					{props.entry.children &&
						<Show when={open()}>
							<Entries of={props.entry.children}>
								{(title, entry) => (
									<Entry title={title} entry={entry()} index={props.index} />
								)}
							</Entries>
						</Show>
					}
				</>
				: (
					<header class="text-gray dark:text-darkgray pt-4">
						{props.title}
					</header>
				)
			}
		</div>
	)
}