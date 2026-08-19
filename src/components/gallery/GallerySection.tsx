import type { GalleryImage } from "@data/Gallery";
import { Frame, BalancedMasonryGrid as MasonryGrid } from '@masonry-grid/solid-js';
import { clsx } from "clsx";
import { type Component, For, type JSX, type JSXElement } from "solid-js";

declare module "solid-js" {
    namespace JSX {
        interface ImgHTMLAttributes<T> {
            "prop:image"?: GalleryImage;
        }
    }
}

export interface GallerySectionProps extends JSX.HTMLAttributes<HTMLElement> {
    images: GalleryImage[];
    decoration?: JSXElement[];
    description: JSXElement;
    setImage: (image: GalleryImage) => void;
    dialog: HTMLDialogElement;
}

export const GallerySection: Component<GallerySectionProps> = (props) => {
    return (
        <section
            class="content grid grid-cols-[1fr] grid-rows-[auto,auto] md:gap-x-20 relative"
        >
            {/* extra styling */}
            <For each={props.decoration}>
                {element => (
                    element
                )}
            </For>

            <div class="description flex flex-col gap-10">
                {props.description}
            </div>

            <MasonryGrid class={clsx(props.class, "mt-10 mx-auto w-full")} frameWidth={180} gap={10}>
                <For each={props.images}>
                    {image => (
                        <Frame width={image.width} height={image.height} onClick={() => {
                            props.setImage(image);
                            props.dialog.showModal();
                        }}>
                            <img class="gallery-image cursor-pointer"
                                src={`/gallery/${image.src}`}
                                alt={image.src.substring(image.src.lastIndexOf('/') + 1, image.src.lastIndexOf("."))}
                                prop:image={image} />
                        </Frame>
                    )}
                </For>
            </MasonryGrid>
        </section>
    );
};
