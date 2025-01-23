import {createSignal, lazy, onMount} from "solid-js";
import { Routes, Route } from "@solidjs/router";
import { Navbar } from "@components/shared/Navbar";
import { Limiter } from "@components/shared/Limiter";
import { Footer } from "@components/shared/Footer";
import { Loading } from "@components/shared/Loading";
import { Songplayer } from "@components/music/Songplayer";

const Home = lazy(() => import("@pages/Home"));
const Projects = lazy(() => import("@pages/Projects"));
const Songs = lazy(() => import("@pages/Songs"));
const Book = lazy(() => import("@pages/Book"));
const Github = lazy(() => import("@pages/Github"));

export let mouseDown = false;

export const [theme, setTheme] = createSignal<string>(localStorage.theme);

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

    onMount(() => {
        const theme = localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
        console.log(theme ? 'dark' : 'light');
        setTheme(theme ? 'dark' : 'light');
    });

    return <>
        <Loading>
            <Songplayer>
                <Navbar />
                <Limiter>
                    <Routes>
                        <Route path="/" component={Home} />
                        <Route path="/projects" component={Projects} />
                        <Route path="/music" component={Songs} />
                        <Route path="/book/" component={Book} />
                        <Route path="/book/*chapter" component={Book} />
                        <Route path="/github" component={Github} />
                    </Routes>
                </Limiter>
                <Footer />
            </Songplayer>
        </Loading>
    </>
};
