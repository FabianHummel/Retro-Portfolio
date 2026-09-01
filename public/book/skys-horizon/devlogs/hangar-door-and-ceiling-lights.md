# Hangar Door & Ceiling Lights

I worked on some scenic hangar elements such as the airlock door and ceiling light.

![Hangar door and ceiling lights demonstration](hangar-door-and-ceiling-lights.webm)

There are a few things to note here from a technician point of view:

## Ceiling Lights:

The ceiling lights allow actual sunlight to shine through the roof, because normal light blocks wouldn't reach the floor and illuminate the room, so I cut holes in the ceiling whenever the lights are activated. The lighting calculations are fast enough to handle these updates without noticable lag.

The light cone is currently just a 3d model made in Blender, but I would like to explore dynamic light cone rendering in shaders, which should yield much more realistic results.

The logic and timing of the "animation" is actually just some redstone wired above the rooftop of the hangar. I love how commands and redstone play together so nicely!

## Airlock Door:

The door is using [Animated Java (AJ)](https://animated-java.dev/) to programmatically animate a composite model consisting of block displays. Nothing to fancy ;)

However, the door has a system to automatically close after a set delay or behind the player when they step through using marker regions on each side of the door that detect contained entities. I'll try to keep everything clean and modular as you may already have noticed!

## Interaction / Task Crosshair:

The interaction system is a little more complicated. I wanted to create a way for the player to perform actions that take a while to execute, such as entering vehicles, opening doors, using tools, etc... Minecraft natively does not have such functionality as any interaction is always instant. We can, however, abuse item consumption to detect holding the right mouse button (or the left shoulder button for controllers)

Now for actually displaying the crosshair, I modified the internal text shader to show different crosshairs, such as the task / progress or attack crosshair depending on the text's color. The added benefit of using the text shader together with the timing options of `/title @s times`, I can get smooth animations through the color's alpha value, without setting the title each tick!

This means I only need to show a new title every time the direction changes or the animation reaches the start or end (alpha 0.0 or 1.0). When the animation changes direction somewhere in the middle of the current animation, the correct time offset is calculated in the scoreboard and is passed to the shader through the color channel.
