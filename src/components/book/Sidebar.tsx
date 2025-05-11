import {JSX, Suspense} from "solid-js";
import {Entries} from "@solid-primitives/keyed";
import {book, bookFontSize, openedArticleIndex, setBookFontSize, setSmoothBookFont, smoothBookFont} from "@pages/Book";
import {Entry} from "@components/book/Entry";
import {PixelImage} from "@components/shared/PixelImage";
import {theme} from "@src/App";

export interface SidebarProps extends JSX.HTMLAttributes<HTMLDivElement> {

}

export default function Sidebar(props: SidebarProps) {
    return (
        <aside {...props}>
            <div class="flex flex-row pt-4 gap-2">
                <div class="cursor-pointer" onClick={() => setSmoothBookFont(!smoothBookFont())}>
                    { smoothBookFont() ? (
                        <PixelImage src={"/img/book/Pixel Font.png"} darkSrc={"/img/book/Pixel Font Dark.png"} w={6} h={5} scale={5} />
                    ) : (
                        <img src={ theme() === "light" ? "/img/book/Smooth Font.svg" : "/img/book/Smooth Font Dark.svg"} width={25} height={25} />
                    ) }
                </div>

                <PixelImage
                    class="cursor-pointer"
                    onClick={() => setBookFontSize(Math.min(bookFontSize() + 0.1, 2))}
                    src={"/img/book/Font Size Bigger.png"}
                    darkSrc={"/img/book/Font Size Bigger Dark.png"}
                    w={5} h={5} scale={5} />

                <PixelImage
                    class="cursor-pointer"
                    onClick={() => setBookFontSize(Math.max(bookFontSize() - 0.1, 0.5))}
                    src={"/img/book/Font Size Smaller.png"}
                    darkSrc={"/img/book/Font Size Smaller Dark.png"}
                    w={5} h={5} scale={5} />
            </div>

            <Suspense fallback="Loading...">
                <Entries of={book}>
                    {(title, entry) => <Entry title={title} entry={entry()} index={openedArticleIndex()}/>}
                </Entries>
            </Suspense>
        </aside>
    )
}