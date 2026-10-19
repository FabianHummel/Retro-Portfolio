import type { Component } from "solid-js";
import { A } from "@solidjs/router";
import { theme } from "@src/App";

export const Featured: Component = () => {
    return (
        <section id="featured-section" class="h-216 content">
            <main class="h-full max-w-lg mx-auto flex flex-col gap-6">
                <img src={theme() === "light" ? "/img/projects/skys-horizon.png" : "/img/projects/skys-horizon-dark.png"} alt="Sky's Horizon Logo" class="mt-20" />
                <div id="featured-text" class="mt-16">
                    <p id="featured-title" class="mb-8" style="font-variant: small-caps;">
                        <b>Featured:</b> Sky's&nbsp;Horizon
                    </p>
                    <p id="featured-subtitle" class="leading-tight text-left!">
                        <em>Venture through foreign tales, research advanced technology, seek friendship with the unknown.</em>
                    </p>
                </div>

                <p>
                    <A href="/book/skys-horizon.md">Read the article</A>
                </p>
            </main>
        </section>
    )
}
