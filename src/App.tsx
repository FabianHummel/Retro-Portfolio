import { lazy } from "solid-js";
import { Routes, Route } from "@solidjs/router";
import { Navbar } from "@components/shared/Navbar";
import { Limiter } from "@components/shared/Limiter";
import { Footer } from "@components/shared/Footer";
const Home = lazy(() => import("@pages/Home"));
const Projects = lazy(() => import("@pages/Projects"));
const Songs = lazy(() => import("@pages/Songs"));

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
				<Route path="/music" component={Songs} />
			</Routes>
		</Limiter>
		<Footer />
	</>
};