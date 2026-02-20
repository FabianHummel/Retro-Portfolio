# Squavy (Old)

![Squavy Logo](squavy-old/logo.webp?width=200px&style={"float":"right","margin":"1rem","margin-right":"-1rem","shape-outside":"circle(50%)"})

A lot has changed since Harmony Hub and virtually all aspects of the program have been rewritten and redesigned. The design probably has had the biggest impact during the overhaul - *I wasn't the only one who hated the red tint...* It was a sickening disease that spread throughout the whole program, so it had to go.

But also the rest of the application was in a pretty bad shape like the collaboration implementation and... *oh boy, I think the audio synthesis was even worse than the initial frontend-design...*. Fixing the massive latency issues was high up on our priority-list, and we tried everything to somehow get along with the WebAudio API - without success. However, more about that further down.

---

![Program Screenshot](squavy-old/program.webp?align=center&width=600px)

## Uhm, the Design is *still bad?*

*Yea, about that...* I tried to improve the initial red-tinted user interface by heading in the opposite direction and I may have overshot a little. Some pixels were too small, some too big, none of them aligned to a grid, some were too colorful, whereas some too monochrome. All in all, it looked like a big messy pile of pixels and completely off the line of what we've had planned for Squavy.

I had a fairly clear vision in mind of what I wanted to accomplish, namely keeping the pixel-art style, but refining it to be absolutely perfect. *But let me tell you:* It's soooo incredibly hard to create a pleasing UI without impairing visual clarity, especially the font still had to be readable at such small scale. However, I soon came up with my first concept I designed in Aseprite:

![New Design Concept](squavy-old/new-design-concept.png?align=center&width=600px&style={"image-rendering":"pixelated"})

I spent the next time thinking of how I could possibly implement this design language technically and played with many different ideas - some of them seemed rather odd, others however, doable. And with that I mean ideas like porting the entire application to full C++/Emscripten or even C# together with Raylib, because I knew it was certainly possible to do stuff like that in the browser.

These things would have made the pixel-perfect design a little easier, because I could use shaders that aid with visual effects and pixel-art, but everything else seemed unnecessarily difficult like performance and compatibility. So I sticked with SolidJS, but shot for the stars and told myself to actually write a good application this time: **structured**; **coherent**; **predictable**; **testable**. Sounds like lots of AI-bullshit, I know, but I really am proud of what I accomplished next.
