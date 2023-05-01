import { active } from "@components/home/Password";
import { Component, Show, createEffect } from "solid-js";
import { start } from "portfolio-game"

export const height = () => gameRef.clientHeight

export let gameRef: HTMLElement;

export const Game: Component<{}> = () => {

	createEffect(() => {
		active() && initialize()
	})

	const initialize = () => {
		console.log("initialize game");
		console.log(document.getElementById('game'));
		
		start();
	}

	return (
		<Show when={active()}>
			<section ref={gameRef} class="h-screen w-full">
				<canvas id="game" class="w-full h-full" />
			</section>
		</Show>
	)
}