import { lazy } from "solid-js";
import { Routes, Route } from "@solidjs/router";
import { Navbar } from "./components/Navbar";
import { Limiter } from "./components/Limiter";
const Home = lazy(() => import("./pages/Home"));
const Projects = lazy(() => import("./pages/Projects"));
const Music = lazy(() => import("./pages/Music"));

export let mouseDown = false;

['mousedown', 'touchstart'].forEach((event) => {
	document.addEventListener(event, () => {
		mouseDown = true
	})
});

['mouseup', 'touchend'].forEach((event) => {
	document.addEventListener(event, () => {
		mouseDown = false
	})
});

export default function App() {
	return <>
		<Navbar />
		<Limiter>
			<Routes>
				<Route path="/" component={Home} />
				<Route path="/projects" component={Projects} />
				<Route path="/music" component={Music} />
			</Routes>
		</Limiter>
	</>
};