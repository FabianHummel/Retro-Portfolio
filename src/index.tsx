/* @refresh reload */
import './style.css';
import './markdown.css'
import { Songplayer } from '@components/music/Songplayer';
import { Footer } from '@components/shared/Footer';
import useLoading, { Loading } from '@components/shared/Loading';
import { Navbar } from '@components/shared/Navbar';
import { HashRouter, Route } from '@solidjs/router';
import { lazy } from 'solid-js';
import { render } from 'solid-js/web';
import App from './App';

function withLoadingScreen<T>(importCb: () => Promise<T>) {
    return async () => {
        const { startLoading } = useLoading();
        const complete = startLoading(0.5);
        const book = await importCb();
        complete();
        return book;
    }
}

const Home = lazy(() => import("@pages/Home"));
const Projects = lazy(() => import("@pages/Projects"));
const Songs = lazy(withLoadingScreen(() => import("@pages/Songs")));
const Book = lazy(withLoadingScreen(() => import("@pages/Book")));
const Github = lazy(withLoadingScreen(() => import("@pages/Github")));

render(
    () => (
        <HashRouter root={props => (
            <Loading>
                <Songplayer>
                    <Navbar />
                    <App {...props} />
                    <Footer />
                </Songplayer>
            </Loading>
        )}>
            <Route path="/" component={Home} />
            <Route path="/projects" component={Projects} />
            <Route path="/music" component={Songs} />
            <Route path="/book/" component={Book} />
            <Route path="/book/*chapter" component={Book} />
            <Route path="/github" component={Github} />
        </HashRouter>
    ),
    document.getElementById('root')
);
