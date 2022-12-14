import { Component, For, JSX } from "solid-js"
import { PixelImage } from "./PixelImage"

export const Styling: Component<{ children: JSX.Element[] }> = (props) => {
	return <>
		<For each={props.children}>
			{(element) => (
				element
			)}
		</For>
	</>
}

export default Styling

export const VerticalLine: Component<{}> = () => {
	return (
		<div class="styling left-16 w-1 h-full bg-gray"></div>
	)
}

export const ChapterText: Component<{ text: string }> = (props) => {
	return (
		<div class="styling left-5" style={`writing-mode: tb-rl; transform: rotate(-180deg);`}>
			{ props.text }
		</div>
	)
}

export const SVGCircle: Component<{ top: number }> = (props) => {
	return (
		<div class="styling left-16 w-4 h-4" style={`top: ${props.top}%;`}>
			<svg viewBox="0 0 16 16" stroke="none" xmlns="http://www.w3.org/2000/svg">
				<circle cx="8" cy="8" r="8"/>
			</svg>
		</div>
	)
}

export const SVGLine: Component<{ top: number, height: number }> = (props) => {
	return (
		<div class="styling left-12 w-1" style={`top: ${props.top}%;`}>
			<svg class="svgline" width="4" height={props.height} viewBox={`0 0 4 ${props.height}`} fill="none" xmlns="http://www.w3.org/2000/svg">
				<line x1="0" y1="0" x2="0" y2={props.height} stroke-width="8" stroke-dasharray="8 8"/>
			</svg>
		</div>
	)
}

export const DownArrow: Component<{ top: number }> = (props) => {
	return (
		<div class="styling left-20" style={`top: ${props.top}%;`}>
			<PixelImage src="img/Continue Light.png" w={5} h={6} scale={3} />
		</div>
	)
}