# Table Tennis

Table Tennis is a cute, minimalistic game written in C++ with a single-player campaign and multiplayer mode _(WIP)_.

---

![gameplay.gif](table-tennis/gameplay.gif?width=30%&style={"float":"right","margin":"1rem"})

I originally developed Table Tennis in order to learn C++, as I thought it'd come in handy some day in my life (which it actually did!). I think I started making this game in 2022 during my third year of HTL and haven't had any prior experience with a low-level language, so it was all relatively new territory - _pointers, references, malloc's and free's, you name it._

Initially the game used SDL2, which I upgraded to SDL3 not too long ago, which perfectly suits the requirements of this minimalistic game and lets me quickly add new features with the help of my custom developed [entity component system](/#/book/table-tennis/ecs.md).

The design is heavily inspired by [Twini-Golf](https://polymars.itch.io/twini-golf) by Polymars but also by a very fun YouTuber I watched regularly at that time: [Let's Game It Out](https://youtube.com/@letsgameitout).