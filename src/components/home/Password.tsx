import { PixelImage } from "@components/shared/PixelImage";
import { gameRef } from "@components/home/Game";
import { Component, For, createSignal, onCleanup, onMount } from "solid-js";

export const [active, setActive] = createSignal(false)

export const Password: Component<{}> = () => {

	const passcode = "hello"
	const allowed = "abcdefghijklmnopqrstuvwxyz0123456789"
	const [keysPressed, setKeysPressed] = createSignal<string[]>([])

	const onKey = (e: KeyboardEvent) => {
		if (active()) return

		allowed.includes(e.key.toLowerCase()) && showKey(e.key.toLowerCase())
		if (keysPressed().join("") == passcode.toLowerCase()) {
			setActive(true)

			window.scrollY == 0 && window.scroll({
				top: gameRef.clientHeight,
			})
			window.setTimeout(() => {
				setKeysPressed([])
			}, 1300)
		}

		else if (keysPressed().length >= passcode.length) {
			setActive(null)
			window.setTimeout(() => {
				setKeysPressed([])
				setActive(false)
			}, 2000)
		}
	}

	const showKey = (key: string) => {
		setKeysPressed([...keysPressed(), key])
	}

	onMount(() => {
		window.addEventListener("keypress", onKey)
	})

	onCleanup(() => {
		window.removeEventListener("keypress", onKey)
	})

	return (
		<section class="w-full h-full fixed flex flex-col-reverse z-10 pointer-events-none">
			<div class={`w-full h-32 flex justify-center items-center ${active() === true && 'animate-pwcorrect'} ${active() === null && 'animate-pwincorrect'}`}>
				<For each={keysPressed()}>
					{(key) =>
						<div class="grid place-content-center animate-keyscale first:animate-firstkeyscale">
							<div class="w-8 h-8 bg-key animate-keyin relative flex justify-center">
								<div class="absolute -z-10 filter drop-shadow-lg">
									<PixelImage src="img/Key.png" w={8} h={8} scale={5} />
								</div>
								<p class="leading-[0.8] text-l translate-x-[2px]">{key}</p>
							</div>
						</div>
					}
				</For>
			</div>
		</section>
	)
}