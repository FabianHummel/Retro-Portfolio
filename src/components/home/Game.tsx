import { active } from "@components/home/Password";
import { Component, Show, createEffect } from "solid-js";

export const height = () => gameRef.clientHeight

export let gameRef: HTMLElement;

export const Game: Component<{}> = () => {

	createEffect(() => {
		active() && initialize()
	})

	const initialize = () => {
		// initialize wasm
	}

	return (
		<Show when={active()}>
			<section ref={gameRef} class="h-screen w-full">
			</section>
		</Show>
	)
}