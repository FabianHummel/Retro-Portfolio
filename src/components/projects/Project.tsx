import { Component, For, JSXElement } from "solid-js";
import { TypedText } from "../TypedText";

export const Project : Component<{ title: string, text: string[], decoration: JSXElement[] }> = (props) => {
	return (
		<section class="relative py-10 pl-36 pr-24 grid grid-cols-[1fr,auto] grid-rows-[6rem,auto] gap-x-20">
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

			{/* extra styling */}
			<For each={props.decoration}>
				{(element) => (
					<>{element}</>
				)}
			</For>
		</section>
	)
}