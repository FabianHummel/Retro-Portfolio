import { Component, createSignal, onMount } from "solid-js";
import { createViewportObserver } from '@solid-primitives/intersection-observer';

export const TypedText : Component<{ children: string, onIntersect?: boolean, delay?: number, offset?: number }> = (props) => {

	const [intersectionObserver] = createViewportObserver()

	let interval;
	let i = 0;
	const [text, setText] = createSignal("");

	const increment = () => {
		if (i < props.children.length) {
			setText(text() + props.children[i++]);
		}
	}

	const startAnimation = () => {
		clearInterval(interval)
		interval = setInterval(increment, props.delay ?? 75);
	}

	if (!props.onIntersect) {
		onMount(() => {		
			setTimeout(() => {
				startAnimation();
			}, props.offset * 1000 ?? 0)
		})
	}

	return <>
		<span use:intersectionObserver={(e) => {
			if (props.onIntersect) {
				if (e.isIntersecting) {
					startAnimation()
				} {
					setText("")
					i = 0;
				}
			}
		}}>{ text() || <br/> }</span>
	</>
}