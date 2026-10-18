import { type Component, createSignal, type JSX, onMount, onCleanup } from "solid-js";

interface TypedTextProps extends JSX.HTMLAttributes<HTMLDivElement> {
    children: string;
    onIntersect?: boolean;
    delay?: number;
    offset?: number;
}

export const TypedText: Component<TypedTextProps> = (props) => {

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

    function handleIntersect([entry]: IntersectionObserverEntry[]) {
        if (!props.onIntersect) {
            return
        }
        if (entry.isIntersecting) {
            startAnimation()
        }
        setIndex(0);
    }

    function getText(): JSX.Element {
        const remainingText = props.children.substring(index());
        return <>{props.children.substring(0, index())}<span class="text-light dark:text-black">{remainingText}</span></>;
    }

    let ref!: HTMLSpanElement;

    let intersectionObserver = new IntersectionObserver(handleIntersect, {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    });

    onMount(() => {
        intersectionObserver.observe(ref);
    });

    onCleanup(() => {
        intersectionObserver.disconnect();
        window.clearInterval(interval);
    });

    return (
        <span ref={ref} class="row-start-1 col-start-1">{getText() || <br />}</span>
    )
}
