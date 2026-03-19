# Adding C++ Support

> *If you think that getting WebAssembly to work was already difficult enough, then I suggest you don't read what is written here...*

Integrating C++ was a tough task that required combining many different technologies and languages to get working fairly good. However, before proceeding, I want to explain why adding C++ is needed in the first place:

## Idea

As Squavy grew larger and larger I played with many ideas to integrate more sophisticated features. One thing, however, stood out by far the most - *full, native VST support*. For you technical readers it may already be pretty clear why that's such a big task. See, Squavy is a fully browser-based program and the browser is really damn good at isolating its content from the rest of the computer. Us web developers heavily rely on web APIs to communicate with the outer world, so integrating external audio plugins will be a fun task ;)

The idea is to create a native "agent" application (small program that mostly lives in the tray and operates in the background) that handles communication between the browser and the native audio host & graphical user interface. C++ plays an essential role here, as it is one of the few languages that has the ability to connect all these different facades into one program. Essentially, we need the following components that should all play together nicely:

1. Audio processing and external plugins via **Squavy's Synth** and **JUCE**
2. Fast bidirectional communication between the native agent and the browser via **uWebSockets**
3. Graphical user interface for Windows, macOS and Linux via **WinUI/WPF**, **SwiftUI** and **GTK** respectively