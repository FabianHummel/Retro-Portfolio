# Harmony Hub

![Harmony Hub Logo](harmony-hub/logo-dark.svg?theme=light&width=200px&style={"float":"right","margin":"2rem","shape-outside":"circle(50%)"})
![Harmony Hub Logo](harmony-hub/logo.svg?theme=dark&width=200px&style={"float":"right","margin":"2rem","shape-outside":"circle(50%)"})

It all started with **Harmony Hub**, a collaboration oriented program to create and share digital music. Learning an instrument and let alone creating own music is known to be a really steep learning curve, and digital composition isn't any better in this regard. Sure, you don't have to learn an instrument, as the computer plays the music by itself, but it's hard to initially grasp the concept of digital music creation. Many digital audio workstations don't simplify the entry for beginners, as every program does music creation differently. In fact, there is no such thing as the gold standard - digital composition is such a broad spectrum and can be done in dozens of different ways possible.

## Idea

With Harmony Hub, we wanted to create a beginner friendly DAW (*digital audio workstation*) by hiding complex features behind structured menus to allow for a better overview of the program and to shift the focus on actual music creation. However, also more advanced people are welcome to express their creativity in Harmony Hub.

As seen in the screenshots below, we opted for a retro style with lots of visual effects to give Harmony Hub a unique and distinct look. It was a clear decision to keep distance from a boring industry-standard look to encourange people to try something new. In future versions, we refined this look numerous times to improve clarity and user-experience.

---

![Program Screenshot](harmony-hub/program.webp?align=center)

## Technologies

Harmony Hub's frontend was initially written in React, realtime collaboration was backed by an express server and the audio synthesis was a mixture between the WebAudio API and our own synthesizer implementation, because we had to deal with latency issues and object pooling.

## Technical Difficulties

Initially, we immediately went with industry-standard libraries to build Harmony Hub: *Frontend?* **React.** *Audio?* **WebAudio API.** The truth is, the world doesn't work like that and we soon had to adapt. Only a few months into the process we noticed that the software is going to be a *little* more complex and demanding than initially anticipated, so we faced a wall... **A big one.**

From time to time the program quickly grew in size and it was difficult to further maintain and develop features without fighting the limits of the Web. See, it was originally written in React, which is fine if you're vibecoding the AI e-commerce platform of the future, but not if you're building a highly dynamic music editor. The browser window would quickly start to become unresponsive upon editing and playing back music, but the WebAudio API is partially at fault there... At the end of the day we decided to rewrite the program from ground up using *SolidJS* which turned out to be the best decision yet.
