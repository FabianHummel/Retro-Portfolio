import type { Component } from "solid-js";
import { TypedText } from "@components/shared/TypedText";
import { Footer } from "@components/shared/Footer";

const WelcomePage: Component = () => {
    return <>
        <section class="relative pt-36 pb-16 flex flex-col gap-5 justify-center items-center">
            <h1 class="font-main">
                <TypedText>
                    Welcome to my book!
                </TypedText>
            </h1>
            
            <p class="title max-w-lg"></p>
        </section>
        
        <section>
            <p class="mt-8">This collection of articles sort of serves as my mental notebook, where I capture random thoughts, progress updates and opinions regarding many different parts of my life, hobbies and interests.</p>
            
            <p class="mt-8">It was <i>- and still is -</i> one of my biggest goals and achievement of this portfolio. I love to have all of my beloved things organized in one place and this library helped me manifest this vision.</p>
            
            <p class="mt-8">Even though I wasn't doing exceptionally well in English and German classes, I nevertheless always liked to write stuff, so naturally I started documenting my projects. </p>
        </section>
        
        <Footer />
    </>
}

export default WelcomePage;
