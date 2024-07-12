import {Component, JSX, createSignal, onMount, createContext, useContext, Setter} from "solid-js";

interface LoadingContextProps {
    load(...pool: string[]): void;
    startLoading(): Setter<number>;
}

export const LoadingContext = createContext<LoadingContextProps>();

export default function useLoading() {
    return useContext(LoadingContext);
}

export const Loading: Component<{ children: JSX.Element }> = (props) => {

    const [progress, setProgress] = createSignal(0);
    const [dots, setDots] = createSignal(0);

    const [loaded, setLoaded] = createSignal(true);

    let loadingScreen: HTMLDivElement;
    let downloaded = new Set<string>();

    onMount(() => {
        let interval = setInterval(() => {
            let current = dots();
            if (current >= 3) setDots(0);
            else setDots(dots() + 1);
        }, 500);

        return (() => {
            clearInterval(interval);
        })
    })

    function load(...pool: string[]) {
        if (pool.every(item => downloaded.has(item))) return;

        setProgress(0);
        setLoaded(false);
        let total = 0;
        for (let item of pool) {
            if (!downloaded.has(item)) {
                let xhr = new XMLHttpRequest();
                xhr.open('GET', item, true);
                xhr.responseType = 'blob';

                xhr.onload = function() {
                    if (xhr.status === 200) {
                        downloaded.add(item);
                        setProgress(progress() + 1 / pool.length);

                        if (++total === pool.length) {
                            setProgress(1);
                            setLoaded(true);
                        }
                    }
                }

                xhr.onprogress = function(event) {
                    if (event.lengthComputable) {
                        setProgress(progress() + event.loaded / event.total / pool.length / 100);
                    }
                }

                xhr.send();
            }
        }
    }

    function startLoading() {
        setProgress(0);
        setLoaded(false);
        return setProgress;
    }

    return (
        <LoadingContext.Provider value={{ load, startLoading }}>
            <section ref={loadingScreen} class="h-screen" id="loading-screen" classList={{
                "loaded": loaded()
            }}>
                <div id="loading-container" class="select-none pointer-events-none absolute inset-0 z-50 h-full bg-white flex flex-col gap-2 items-center justify-center">
                    <h1>Loading{".".repeat(dots())}</h1>
                    <div id="loading-bar" class="w-[200px]">
                        <div id="loading-items" style={`width:${Math.floor(progress() * 10) * 18}px;`} />
                    </div>
                </div>

                {props.children}
            </section>
        </LoadingContext.Provider>
    )
}
