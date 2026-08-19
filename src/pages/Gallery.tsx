import { GallerySection } from "@components/gallery/GallerySection";
import { PixelImage } from "@components/shared/PixelImage";
import { ChapterText, DownArrow, SVGCircle, SVGLine, VerticalLine } from "@components/shared/Styling";
import { TypedText } from "@components/shared/TypedText";
import { type Component, createSignal, createEffect, on, Show, onMount, onCleanup } from "solid-js";
import { GalleryData, GalleryImage } from "@data/Gallery";

const Gallery: Component = () => {

    const [image, setImage] = createSignal<GalleryImage>(null);

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
    });

    createEffect(on(image, image => {
        if (image !== null) {
            document.documentElement.style.overflow = "hidden";
        } else {
            document.documentElement.style.overflow = "";
        }
    }));

    function nextImage(next: boolean) {
        if (image() === null) return;

        const currentImage = document.querySelector(`img.gallery-image[src="/gallery/${image().src}"]`) as HTMLImageElement | null;
        if (!currentImage) return;

        const target = next ? currentImage.parentElement.nextSibling?.firstChild : currentImage.parentElement.previousSibling?.firstChild;
        if (target && target instanceof HTMLImageElement) {
            setImage((target as any).image as GalleryImage);
        }
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
                I don't draw often, but whenever I do, it brings me joy.
                <br />
                And what's possibly better than sharing art?
                <br />
                <br />
                <i style={"line-height: 1rem;"}>♡ mostly for my fur-loving people ♡</i>
            </p>

            <div class="styling left-16 bottom-0 w-1 h-40 bg-gray dark:bg-darkgray" />
        </section>

        <dialog
            ref={galleryImageDialog}
            id="gallery-image-dialog"
            class="bg-[transparent] outline-none"
            onClose={() => {
                setImage(null);
            }}
            onClick={onClickDialog}
        >
            <div class="grid grid-cols-[1fr] sm:grid-cols-[auto,1fr,auto] grid-rows-[auto,auto] lg:grid-cols-[auto,auto,auto,auto] lg:grid-rows-none items-center gap-y-10">
                <div class="hidden sm:grid place-items-center px-10 h-full cursor-pointer"
                    onClick={() => nextImage(false)}>
                    <PixelImage
                        src="/img/gallery/Previous.png"
                        darkSrc="/img/gallery/Previous.png"
                        alt="Download article"
                        w={3} h={5} scale={5} />
                </div>

                <Show when={image()}>
                    <img src={`/gallery/${image().src}`} alt="Gallery Preview" class="lg:max-w-[800px] sm:max-h-[90vh] w-full" />
                </Show>

                <div class="hidden sm:grid place-items-center px-10 h-full cursor-pointer"
                    onClick={() => nextImage(true)}>
                    <PixelImage
                        src="/img/gallery/Next.png"
                        darkSrc="/img/gallery/Next.png"
                        alt="Download article"
                        w={3} h={5} scale={5} />
                </div>

                <div class="place-self-start text-white lg:max-w-96 sm:col-start-2 lg:col-start-auto">
                    {image()?.description}
                </div>
            </div>
        </dialog>

        <GallerySection
            setImage={setImage}
            dialog={galleryImageDialog}
            description={<>
                <p>Even as a young boy, I was very drawn to art and quickly began creating art on my own, which makes sense because I was surrounded by a very creative and talented family - my mother loved to paint on canvases, my sister was fenomenal with traditional pencil art and my father... <i>well</i>, he discovered painting mini-figures many years later, at which he actually is incredibly talented as well.</p>

                <p>Speaking of my older sister, when we were in the age of 10 and 14, we would often sit at table together and draw pencil art, at which I had gotten pretty good, <i>even though most of the motifs were blatantly copied from the internet, but whatever...</i> Unfortunately, I lost my old sketchbook where I drew my very first things, so the pictures below were created a little later when I already kind of knew what I was doing:</p>
            </>}
            images={GalleryData["old-art-book"]}
            decoration={[
                <ChapterText text={`0.1 First attempts at art`} />,
                <VerticalLine />,
                <SVGCircle top={30} />,
                <SVGLine top={30} height={200} />,
                <DownArrow top={80} />,
                <DownArrow top={20} />,
            ]}
        />

        <GallerySection
            setImage={setImage}
            dialog={galleryImageDialog}
            class={"max-w-[900px]"}
            description={<>
                <p>As I grew older, I (obviously) started to consume content on social media and soon got interested in anime/manga-styled art, even though I never watched any real anime at this point - I was just there for the art, but I wagely remember being <i>reeeallly</i> into <i>Angel Devil</i> from <i>Chainsaw Man</i>.</p>

                <p>I also never tried to draw a fully fleshed out picture with color, but rather sticked with lead pencils instead - I don't know why, but quick sketches were everything I needed at the time. However, I think the improvement is very noticable, even though I didn't draw anything for four years straight. I started to experiment with shading and lighting, but the proportions were still off most of the time.</p>
            </>}
            images={GalleryData["sketchbook"]}
            decoration={[
                <ChapterText text={`0.2 Anime Sketches`} />,
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
            class={"max-w-[900px]"}
            description={<>
                <p>After taking a long break again, I grew <b>EVEN</b> older (19 now) and consumed <b>EVEN MORE</b> content on social media <i>(I know, not very healthy, but I try my best to keep an eye on it...)</i> and <i>reaaaallly</i> got into Furry art, because it's very emotionally and artistically expressive and helped me through a pretty deep down-phase of my life.</p>

                <p>Sadly, this topic is still very controversial in our society and it was fairly hard to get over myself and explain my hobby to the people I know and love, but they eventually let it slide and are very chill about it now. — <i>Shoutout to my friends!!! Love you! ♡</i></p>

                <p>From an artistic perspective, you can't say I didn't improve a lot since the last time. Taking <b>LONG</b> breaks <i>(and I mean years)</i> seems to help a lot and this was the first time I am actually really proud of what I accomplished here. I also upgraded my gear to a Toned Gray Sketch Paper from Strathmore together with a set of 24 polychromos pencils from Faber-Castell, which I can only absolutely recommend, it's such a different feeling and so rewarding!</p>
            </>}
            images={GalleryData["furry-art"]}
            decoration={[
                <ChapterText text={`0.3 Furries`} />,
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
