# Animated Logo

During the last sequence of the introduction movie, the player flies far away with their spaceship and continously accelerates. Next to a heavy camera shake effect - which is by the way described [here](/#/book/skys-horizon/devlogs/camera-shake.md) - the screen slowly fades to a fully white screen. Then, the game's logo should fade in with a nice SVG-path-like animation.

## Experimenting with Shader-driven Animations

Initially, I planned on using a dynamic-fill animation, but it lead to issues later on which I will explain shortly:

![Dynamic Text Fill](dynamic-text-fill.webm)

I probably overengineered this feature, but I still think it's worth it, considering the cutscene is really important, as it's the transition between the introduction movie and the actual game shortly after the crash-scene.