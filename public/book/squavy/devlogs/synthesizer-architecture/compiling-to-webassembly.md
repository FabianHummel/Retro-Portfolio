# Compiling to WebAssembly

As already mentioned earlier, I chose Rust because it has really good WebAssembly support using `wasm_bindgen`. Here, it's enough to mark the struct for binding generation. The actual fields of the struct are irrelevant to the Javascript part, *hence the `skip`-attribute*, as we will modify the synthesizer's state using setter functions. The reason for this is explained later [here](/#/book/squavy/devlogs/synthesizer-architecture/interacting-with-the-synthesizer.md).

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

#[cfg_attr(feature = "wasm", wasm_bindgen::prelude::wasm_bindgen)]
impl Synthesizer {
    #[cfg_attr(feature = "wasm", wasm_bindgen::prelude::wasm_bindgen(js_name = "synthesize"))]
    pub fn synthesize(&mut self, current_frame: i64, start_offset: i64, frame_size: usize, sample_rate: i64, playback: bool, left: &mut [f32], right: &mut [f32]) {
        // audio processing
    }
}
```

This gives us a `.wasm` file and a Javascript binding file to call and interact with our synthesizer. Normally, the generated package can be included like any ordinary npm-package, but remember that our code does audio-processing. *It should run in a dedicated audio thread.* This complicates things and requires some clever tricks to get running.