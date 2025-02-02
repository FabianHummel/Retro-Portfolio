import { PixelImage } from "@components/shared/PixelImage";
import { Link } from "@solidjs/router";
import { Component, For, Show, createSignal } from "solid-js";
import {Entry as EntryData} from "@pages/Book";
import {Entries} from "@solid-primitives/keyed";

export const Entry: Component<{
	title: string,
	entry: EntryData,
	index: number,
}> = (props) => {

	const [open, setOpen] = createSignal(false);

	return (
		<div class="text-m pl-6 border-l-2 border-l-gray">
			{props.entry.path
				? <>
					<Link href={`/book/${props.entry.path}`}>
						<div class="flex justify-between items-center cursor-pointer">
							<header class="text-black dark:text-gray flex-1" onClick={() => {
								setOpen(true);
							}}>
								{props.title}
							</header>
							{props.entry.children &&
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
							}
						</div>
					</Link>
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