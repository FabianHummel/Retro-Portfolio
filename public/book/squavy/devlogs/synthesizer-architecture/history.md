# Squavy's Modular Synthesizer Engine

![Squavy's Modular Synthesizer Engine](smse-logo.svg?width=300px)

The synthesizer is Squavy's core library that generates real-time audio based on MIDI-notes and a stateful structure that holds instrument-, pattern- and note-related data. Originally, the synthesizer was a weird mix of the WebAudioAPI and custom Javascript logic and worked solely in the browser. Later during development we noticed that a pure Javascript-based implementation wouln't meet our expectations, so I decided to rewrite the synthesizer in Rust, mainly because it has great WebAssembly support and fit our needs perfectly.

During that time I also played with the thought of how I could integrate external plugins in the future, which lead to the decision that I design the synthesizer to be fully standalone, which would help integrating native functionality into it.

However, cross compilation to both WebAssembly and a native binary (with C++ interoperability), required many clever techniques to get working and was everything but a straightforward task. Note that, for the explanatory part, I will primarily focus on the synthesizer struct, as it's enough to demonstrate architecture behind the synthesizer.