import type { Component } from "solid-js";
import "./Featured.css";
import { A } from "@solidjs/router";
import { theme } from "@src/App";

export const Featured: Component = () => {
    return (
        <section id="featured-section" class="content h-[54rem]">
            <main class="h-full max-w-md mx-auto flex flex-col gap-6">
                <img src={theme() === "light" ? "/img/projects/skys-horizon.png" : "/img/projects/skys-horizon-dark.png"} alt="Sky's Horizon Logo" class="mt-20" />
                <div id="featured-text" class="mt-16">
                    <p id="featured-title">
                        <b>Featured:</b> Sky's&nbsp;Horizon
                    </p>
                    <p id="featured-subtitle">
                        <em>Venture through foreign tales, research advanced technology, seek friendship with the unknown.</em>
                    </p>
                </div>

                <A href="/book/skys-horizon.md">
                    <p>
                        Read the article
                    </p>
                </A>
            </main>
        </section>
    )
}
