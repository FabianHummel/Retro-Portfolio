import { JSXElement } from "solid-js";

export interface GalleryImage {
    src: string;
    width: number;
    height: number;
    description?: JSXElement;
}

export const GalleryData = {
    "old-art-book": [
        {
            src: "Old Art Book/Jack Russel Terrier.jpeg",
            width: 2586,
            height: 3921
        },
        {
            src: "Old Art Book/Havaneser.jpeg",
            width: 2616,
            height: 3860
        },
        {
            src: "Old Art Book/Hase.jpeg",
            width: 2625,
            height: 3947
        },
        {
            src: "Old Art Book/Leopard.jpeg",
            width: 2641,
            height: 3816
        },
        {
            src: "Old Art Book/Löwe.jpeg",
            width: 3934,
            height: 2539
        },
        {
            src: "Old Art Book/Zwergspitz.jpeg",
            width: 2629,
            height: 3909
        },
        {
            src: "Old Art Book/Adler.jpeg",
            width: 2608,
            height: 3856
        },
        {
            src: "Old Art Book/Hütehund.jpeg",
            width: 2603,
            height: 3921
        },
        {
            src: "Old Art Book/Schwert.jpeg",
            width: 2521,
            height: 3816
        },
        {
            src: "Old Art Book/Wolf.jpeg",
            width: 2635,
            height: 3951
        },
        {
            src: "Old Art Book/Schildkröte.jpeg",
            width: 3492,
            height: 2991
        },
    ],
    "sketchbook": [
        {
            src: "Sketchbook/Anime Boy 1.jpeg",
            width: 2840,
            height: 3021
        },
        {
            src: "Sketchbook/Anime Boy 2.jpeg",
            width: 2752,
            height: 3718
        },
        {
            src: "Sketchbook/Anime Boy 3.jpeg",
            width: 2404,
            height: 3417
        },
        {
            src: "Sketchbook/Anime Girl 1.jpeg",
            width: 2764,
            height: 3563
        },
        {
            src: "Sketchbook/Boy 1.jpeg",
            width: 2594,
            height: 3667
        },
        {
            src: "Sketchbook/Boy 2.jpeg",
            width: 2146,
            height: 3394
        },
        {
            src: "Sketchbook/Your Side.jpeg",
            width: 2625,
            height: 3606
        },
    ],
    "furry-art": [
        {
            src: "Furry Book/Badger.jpeg",
            width: 3059,
            height: 4082
        },
        {
            src: "Furry Book/Kyle.jpeg",
            width: 3281,
            height: 4792
        },
        {
            src: "Furry Book/Viktor.jpeg",
            width: 3018,
            height: 4670
        },
        {
            src: "Furry Book/Rorschach.jpeg",
            width: 3000,
            height: 4000
        },
        {
            src: "Furry Book/Sina.jpeg",
            width: 2785,
            height: 3945
        },
        {
            src: "Furry Book/Skira mit Katze.jpeg",
            width: 1822,
            height: 2733
        },
        {
            src: "Furry Book/Chris Zwanziger.jpeg",
            width: 2647,
            height: 3970
        },
        {
            src: "Furry Book/Müd Zwanziger.jpeg",
            width: 2421,
            height: 3129
        },
        {
            src: "Furry Book/Simmmie Zwanziger.jpeg",
            width: 3000,
            height: 4000
        },
    ]
} satisfies Record<string, GalleryImage[]>;
