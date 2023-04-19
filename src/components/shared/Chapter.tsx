import { Component, For, JSXElement } from "solid-js";
import { TypedText } from "@components/shared/TypedText";

export const Chapter: Component<{ title: string, text: string[], decoration?: JSXElement[], graphics?: JSXElement }> = (props) => {
	return (
		<section class="content grid grid-cols-[1fr] grid-rows-[auto,auto] md:grid-rows-[6rem,auto] gap-10 md:gap-x-20 md:gap-y-0">
			{/* text */}
			<div class="row-start-1">
				<h2 class="text-l">
					<TypedText onIntersect>
						{props.title}
					</TypedText>
				</h2>
			</div>
			<div class="row-start-2 flex flex-col gap-10">
				<For each={props.text}>
					{(paragraph) => (
						<p class="text-s"> {paragraph} </p>
					)}
				</For>
			</div>

			{/* graphics */}
			{props.graphics ?
				<div class="md:row-start-2 flex flex-col justify-center items-center gap-5">
					{props.graphics}
				</div>
				: null}

			{/* extra styling */}
			<For each={props.decoration}>
				{(element) => (
					element
				)}
			</For>
		</section>
	)
}