# Squavy 

![Squavy Logo](squavy/logo.png?width=200px&style={"float":"right","margin-right":"-1rem","margin-left":"1rem","shape-outside":"circle(50%)"})

The current state of Squavy is unrecognizable from the previous iteration. The pixelated artstyle is defined and made with lots of attention to small details like animated sprites that are brought to live through a saturated color palette.

But also the usability and mobile-compatibility are through the roof with this version. I invested lots of time thoroughly testing different input-combinations like adding a note when long-pressing and double tapping + dragging while to select objects while in pan-mode. The interaction system has become pretty smart and is very convenient to use.

---

![Program Screenshot](squavy/program.webp?align=center&width=800px)

> *Also notice how every single pixel is aligned to a fixed grid, resolving many problems we had with earlier versions of Squavy. Also those little icons, so cute!*

## Internal Project Structure

From a developer's perspective, the project structure is the most significant change of Squavy's redesign. In the screenshot you can see the before and after: Note how all the different panels have moved to individiual npm-modules, with each one containing a separate folder for manual and integration testing. The project is also separated into reusable libraries for icons and shared components used across multiple panels. But there's so much more going on behind the scenes, so I really endorse reading the [devlogs](#/book/squavy/devlogs/aseprite-integration.md)!

![Project Structure Comparison](squavy/project-structure.webp?align=center&width=800px)
