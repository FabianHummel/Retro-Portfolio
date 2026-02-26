# Synthesizer Architecture

The synthesizer is Squavy's core library that generates real-time audio based on MIDI-notes and a stateful structure that holds instrument-, pattern- and note-related data. Originally, the synthesizer was a weird mix of the WebAudioAPI and custom Javascript logic and worked solely in the browser. Later during development we noticed that a pure Javascript-based implementation wouln't meet our expectations, so I decided to rewrite the synthesizer in Rust, mainly because it has great WebAssembly support and fit our needs perfectly.

During that time I also played with the thought of how I could integrate external plugins in the future, which lead to the decision that I design the synthesizer to be fully standalone, which would help integrating native functionality into it.

However, cross compilation to both WebAssembly and a native binary (with C++ interoperability), required many clever techniques to get working and was everything but a straightforward task. I think the easiest way of explaining how I came up with my solution is to step through my thought-process and how I fixed problem after problem. Note that I will mainly focus on the synthesizer struct only, as it's enough to demonstrate the concept.

## Step Nr. 1: Compiling to WebAssembly

As already mentioned earlier, I chose Rust because it has really good WebAssembly support

```rust
#[cfg(feature = "wasm")]
#[wasm_bindgen::prelude::wasm_bindgen]
#[derive(Serialize, Deserialize)]
pub struct Synthesizer {
    #[wasm_bindgen(skip)]
    pub patterns: FxHashMap<String, Rc<RefCell<Pattern>>>,
    #[wasm_bindgen(skip)]
    pub instruments: FxHashMap<String, Instrument>,
    #[wasm_bindgen(skip)]
    pub samples: FxHashMap<String, AudioSample>,
}
```