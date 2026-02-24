# Space Warp

Space flight plays an essential role in Sky's Horizon, therefore it should look and feel realistic. In the video below, you can see the first working version of the shader (currently without any extra effects):

![Demonstration of space warp shader](space-warp-shader.webm)

In the future I will definitely need to improve the effect further, like adding colored trails and metal sparks or an halo around the spaceship's hull to make it even more realistic.

## Technical Implementation

The effect uses an item display with a custom core shader applied to it. The way this works is fairly simple: The item display has a custom item model attached - in this case a simple cube, as it is the most primitive shape available for Minecraft models. The model's texture is even simpler: It only needs to be a single pixel with a very specific color, for example `RGBA: 255, 255, 255, 254`. This makes the pixel act as a "marker" for the shader to detect during rendering and allows us to apply a custom shader in place of the default one.
