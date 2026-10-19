import { GallerySection } from "@components/gallery/GallerySection";
import { PixelImage } from "@components/shared/PixelImage";
import { ChapterText, DownArrow, SVGCircle, SVGLine, VerticalLine } from "@components/shared/Styling";
import { TypedText } from "@components/shared/TypedText";
import { type Component, createSignal, createEffect, on, Show, onMount, onCleanup, createMemo } from "solid-js";
import { GalleryData, GalleryImage } from "@data/Gallery";

const Gallery: Component = () => {

    const [image, setImage] = createSignal<GalleryImage>(null);
    const images = Object.values(GalleryData).flat();

    const currentIndex = createMemo(() => images.indexOf(image()));

    let galleryImageDialog!: HTMLDialogElement;

    function onKeyDown(e: KeyboardEvent) {
        if (image() === null) return;

        if (e.key === "Escape") {
            galleryImageDialog.close();
            setImage(null);
        } else if (e.key === "ArrowLeft") {
            nextImage(false);
        } else if (e.key === "ArrowRight") {
            nextImage(true);
        }
    }

    onMount(() => {
        document.addEventListener("keydown", onKeyDown);
    });

    onCleanup(() => {
        document.removeEventListener("keydown", onKeyDown);

        // interactable.unset();
    });

    createEffect(on(image, image => {
        document.documentElement.style.overflow = image !== null ? "hidden" : "";
    }));

    function nextImage(next: boolean) {
        const targetIndex = currentIndex() + (next ? 1 : -1);
        if (currentIndex() === -1 || targetIndex < 0 || targetIndex >= images.length) return;
        setImage(images[targetIndex]);
    }

    function onClickDialog(e: Event) {
        if (e.target === galleryImageDialog) {
            galleryImageDialog.close();
            setImage(null);
        }
    }

    return <>
        <section class="relative pt-52 pb-36 flex flex-col gap-5 justify-center items-center">
            <h1 class="title">
                <TypedText>
                    Art Gallery
                </TypedText>
            </h1>

            <p class="title max-w-lg">
                I may not draw every day, but every piece brings me joy. And what's possibly better than sharing this feeling?
                <br />
                <br />
                <i style={"line-height: 1rem;"}>♡ mostly for my fur-loving people ♡</i>
            </p>

            <div class="styling left-16 bottom-0 w-1 h-40 bg-gray dark:bg-darkgray" />
        </section>

        <dialog
            ref={galleryImageDialog}
            id="gallery-image-dialog"
            class="bg-transparent outline-none m-auto backdrop:bg-[rgba(0,0,0,0.8)]"
            onClose={() => setImage(null)}
            onClick={onClickDialog}
        >
            <div class="grid grid-cols-[1fr_1fr] grid-rows-[1fr_auto] sm:grid-cols-[auto_1fr_auto] sm:grid-rows-[1fr]">
                <button
                    type="button"
                    class="disabled:opacity-50 outline-none max-sm:col-start-1 grid place-items-center p-8"
                    disabled={currentIndex() === 0}
                    onClick={() => nextImage(false)}
                >
                    <PixelImage
                        src="/img/gallery/Previous.png"
                        darkSrc="/img/gallery/Previous.png"
                        alt="Previous image"
                        w={3} h={5} scale={5} />
                </button>

                <Show when={image()}>
                    <img id="gallery-preview"
                        class="h-full w-full max-w-[95vw] max-h-[80vh] sm:max-h-[95vh] max-sm:row-start-1 max-sm:col-span-2"
                        src={`/gallery/${image().src}`}
                        alt="Gallery Preview" />
                </Show>

                <button
                    type="button"
                    class="disabled:opacity-50 outline-none max-sm:col-start-2 grid place-items-center p-8"
                    disabled={currentIndex() === images.length - 1}
                    onClick={() => nextImage(true)}
                >
                    <PixelImage
                        src="/img/gallery/Next.png"
                        darkSrc="/img/gallery/Next.png"
                        alt="Next image"
                        w={3} h={5} scale={5} />
                </button>
            </div>

            <div class="fixed top-0 right-0">
                <button
                    type="button"
                    class="outline-none max-sm:col-start-1 grid place-items-center p-8"
                    onClick={() => galleryImageDialog.close()}
                >
                    <PixelImage
                        src="/img/gallery/Close.png"
                        darkSrc="/img/gallery/Close.png"
                        alt="Close preview"
                        w={5} h={5} scale={5} />
                </button>
            </div>
        </dialog>

        <GallerySection
            setImage={setImage}
            dialog={galleryImageDialog}
            description={<>
                <p>Even as a young boy, I was very drawn to art and quickly began creating art on my own, which makes sense because I was surrounded by a very creative and talented family - my mother loved to paint on canvases, my sister was fenomenal with traditional pencil art and my father... <i>well</i>, he discovered painting mini-figures many years later, at which he actually is incredibly talented as well.</p>

                <p>Speaking of my older sister, when we were in the age of 10 and 14, we would often sit at the table together and draw pencil art, at which I had gotten pretty good, <i>even though most of the motifs were blatantly copied from the internet, but whatever...</i> Unfortunately, I lost my old sketchbook where I drew my very first things, so the pictures below were created a little later when I already kind of knew what I was doing:</p>
            </>}
            images={GalleryData["old-art-book"]}
            decoration={[
                <ChapterText>0.1 First attempts at art</ChapterText>,
                <VerticalLine />,
                <SVGCircle top={-13} />,
                <SVGCircle top={30} />,
                <SVGLine top={30} height={200} />,
                <DownArrow top={80} />,
                <DownArrow top={20} />,
            ]}
        />

        <GallerySection
            setImage={setImage}
            dialog={galleryImageDialog}
            class="max-w-225"
            description={<>
                <p>As I grew older, I (obviously) started to consume content on social media and soon got interested in anime/manga-styled art, even though I never watched any real anime at this point - I was just there for the art, but I wagely remember being <i>reeeallly</i> into <i>Angel Devil</i> from <i>Chainsaw Man</i>.</p>

                <p>I also never tried to draw a fully fleshed out picture with color, but rather sticked with lead pencils instead - I don't know why, but quick sketches were everything I needed at the time. However, I think the improvement is very noticable, even though I didn't draw anything for four years straight. I started to experiment with shading and lighting, but the proportions were still off most of the time.</p>
            </>}
            images={GalleryData["sketchbook"]}
            decoration={[
                <ChapterText>0.2 Anime Sketches</ChapterText>,
                <VerticalLine />,
                <SVGCircle top={20} />,
                <SVGCircle top={50} />,
                <SVGLine top={30} height={150} />,
                <DownArrow top={80} />,
            ]}
        />

        <GallerySection
            setImage={setImage}
            dialog={galleryImageDialog}
            class="max-w-225"
            description={<>
                <p>After taking a long break again, I grew <b>EVEN</b> older (19 now) and consumed <b>EVEN MORE</b> content on social media <i>(I know, not very healthy, but I try my best to keep an eye on it...)</i> and <i>reaaaallly</i> got into Furry art, because it's very emotionally and artistically expressive and helped me through a pretty deep down-phase of my life.</p>

                <p>Sadly, this topic is still very controversial in our society and it was fairly hard to get over myself and explain my hobby to the people I know and love, but they eventually let it slide and are very chill about it now. — <i>Shoutout to my friends!!! Love you! ♡</i></p>

                <p>From an artistic perspective, you can't say I didn't improve a lot since the last time. Taking <b>LONG</b> breaks <i>(and I mean years)</i> seems to help a lot and this was the first time I am actually really proud of what I accomplished here. I also upgraded to a toned gray sketchbook from Strathmore - it's such a different feeling and drawing gets so rewarding!</p>
            </>}
            images={GalleryData["furry-art"]}
            decoration={[
                <ChapterText>0.3 Furries</ChapterText>,
                <VerticalLine />,
                <SVGCircle top={20} />,
                <SVGLine top={30} height={150} />,
                <SVGLine top={60} height={100} />,
                <DownArrow top={10} />,
                <DownArrow top={30} />,
                <DownArrow top={80} />,
            ]}
        />

        <section class="relative h-20">
            <div class="styling left-16 top-0 w-1 h-4 bg-gray dark:bg-darkgray" />
            <SVGCircle />
        </section>
    </>
}

export default Gallery;
