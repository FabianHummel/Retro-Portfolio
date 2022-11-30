import {Component, For} from "solid-js";
import { TypedText } from "./TypedText";

interface ChaptersProps {
    title: string;
    chapters: Array<Chapter>;
}

interface Chapter {
    title: string;
    section: string;
    link: string;
}

export const Chapters : Component<ChaptersProps> = (props) => {
    return (
        <div class="py-5 flex flex-col">
            <h2 class="text-l h-24">
				<TypedText onIntersect>
					{ props.title }
				</TypedText>
			</h2>
            <For each={ props.chapters }>
                { (item) =>
                    <div class="flex items-end gap-5">
                        <p class="text-s">{ item.title }</p>
                        <svg class="flex-1" width="100%" height="10" viewBox="0 0 100% 3" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <line y1="1.5" x2="100%" y2="1.5" stroke="#282828" stroke-width="3" stroke-dasharray="3 5"/>
                        </svg>
                        <p class="text-s">{ item.section }</p>
                    </div>
                }
            </For>
        </div>
    )
}