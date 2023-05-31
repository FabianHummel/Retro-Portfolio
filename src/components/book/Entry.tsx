import { PixelImage } from "@components/shared/PixelImage";
import { Article, Articles, Entry as EntryProps } from "@data/Book";
import { setIndex } from "@pages/Book";
import { Component, For, Show, createSignal } from "solid-js";

export const Entry: Component<{ entry: EntryProps }> = ({ entry }) => {

	const [open, setOpen] = createSignal(false);

	return (
		<div class="text-m pl-6 border-l-2 border-l-gray">
			{'path' in entry
				? <>
					<div class="flex justify-between items-center cursor-pointer">
						<header class="text-black flex-1" onClick={() => {
							setIndex(Articles.indexOf(entry));
							setOpen(true);
						}}>
							{entry.title}
						</header>
						{entry.children &&
							<PixelImage src={open() ? "/img/book/Retract.png" : "/img/book/Expand.png"} alt="Open/Close Section" w={5} h={5} scale={3} onClick={() =>
								setOpen(!open())} />
						}
					</div>
					{entry.children &&
						<Show when={open()}>
							<For each={entry.children}>
								{(item) =>
									<Entry entry={item} />}
							</For>
						</Show>
					}
				</>
				: (
					<header class="text-gray pt-4">
						{entry.title}
					</header>
				)
			}
		</div>
	)
}