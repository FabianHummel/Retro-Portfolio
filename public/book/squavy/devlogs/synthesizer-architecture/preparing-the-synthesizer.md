# Preparing the Synthesizer

To make the synthesizer play along nicely inside a native application we need to further add to the existing code. Remember the modifications we made to the code for WebAssembly [here](/#/book/squavy/devlogs/synthesizer-architecture/compiling-to-webassembly.md)? We do the exact same thing in order to open the door to C++ interoperability:

```rust
#[cfg(feature = "cxx")]
#[cxx_bindgen::cxx_bindgen]
#[derive(Serialize, Deserialize)]
pub struct Synthesizer {
    pub patterns: FxHashMap<String, Rc<RefCell<Pattern>>>,
    pub instruments: FxHashMap<String, Instrument>,
    pub samples: FxHashMap<String, AudioSample>,
}
```

Unfortunately, I couldn't reuse the existing `Synthesizer` struct and weave in the `cxx`-bindings next to the WebAssembly attributes, but I did manage to do it for the rest of the functions that are exposed in the facade:

```rust
#[cfg_attr(feature = "wasm", wasm_bindgen::prelude::wasm_bindgen)]
#[cfg_attr(feature = "cxx", cxx_bindgen::cxx_bindgen)]
impl Synthesizer {
    #[cfg_attr(feature = "wasm", wasm_bindgen::prelude::wasm_bindgen(js_name = "synthesize"))]
    #[cfg_attr(feature = "cxx", cxx_bindgen::cxx_bindgen(cxx_name = "synthesize"))]
    pub fn synthesize(&mut self, current_frame: i64, start_offset: i64, frame_size: usize, sample_rate: i64, playback: bool, left: &mut [f32], right: &mut [f32]) {
        // audio processing
    }
}
```

Note that the `wasm_bindgen` attribute is only active when the feature flag `wasm` is set, whereas the `cxx_bindgen` attribute is only active when the `cxx` flag is set. With this configuration, the two different build pipelines never collide and everything compiles fine on both sides. *But what actually is that `cxx_bindgen`? Where does it come from?* This part requires a little bit of elaboration...
