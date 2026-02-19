import { createViewportObserver } from '@solid-primitives/intersection-observer';
import { type Component, createSignal, type JSX, onMount } from "solid-js";

interface TypedTextProps extends JSX.HTMLAttributes<HTMLDivElement> {
    children: string;
    onIntersect?: boolean;
    delay?: number;
    offset?: number;
}

export const TypedText: Component<TypedTextProps> = (props) => {

    // biome-ignore lint/correctness/noUnusedVariables: "use:intersectionObserver hook in DOM"
    const [intersectionObserver] = createViewportObserver()

    let interval: number;
    const [index, setIndex] = createSignal(0);

    const startAnimation = () => {
        window.clearInterval(interval)
        interval = window.setInterval(() => {
            setIndex(Math.min(index() + 1, props.children.length));
        }, props.delay ?? 50);
    }

    if (!props.onIntersect) {
        onMount(() => {
            setTimeout(() => {
                startAnimation();
            }, props.offset * 1000)
        })
    }

    function handleIntersect(e: IntersectionObserverEntry) {
        if (!props.onIntersect) {
            return
        }
        if (e.isIntersecting) {
            startAnimation()
        }
        setIndex(0);
    }

    function getText(): JSX.Element {
        const remainingText = props.children.substring(index());
        return <>{props.children.substring(0, index())}<span class="text-light dark:text-black">{remainingText}</span></>;
    }

    return (
        <span class="row-start-1 col-start-1" use:intersectionObserver={handleIntersect}>{getText() || <br />}</span>
    )
}
