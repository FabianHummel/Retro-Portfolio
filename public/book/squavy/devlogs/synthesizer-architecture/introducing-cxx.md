# Introducing CXX

> ## [CXX](https://cxx.rs/) — safe interop between Rust and C++
>
> This library provides a safe mechanism for calling C++ code from Rust and Rust code from C++. It carves out a regime of commonality where Rust and C++ are semantically very similar and guides the programmer to express their language boundary effectively within this regime. CXX fills in the low level stuff so that you get a safe binding, preventing the pitfalls of doing a foreign function interface over unsafe C-style signatures.
>
> *Source: https://cxx.rs/*

As the description above already states, CXX bridges the gap between Rust and C++ by exposing exported Rust symbols to be usable from C++ and vice-versa. In the case of the synthesizer, this would mean that the synth-commands would be called from C++ instead of Javascript. However, CXX is fairly limited and does not support every kind of structure such as Rust `Option` and C++ `std::optional`, so we have to keep that in mind when designing the synthesizer commands.

CXX works by defining a so called *language boundry*, or a set of symbols in an `ffi`-module that should be translated or exposed to the opposing language. For example, the synthesizer would expose its `Synthesizer` struct and all of its functions to change the state such as `update_oscillator_frequency` or `add_instrument` to name a few. Then, the actual C++ library needs to be built by invoking a small script in the `build.rs` file of your library:

```rust
cxx_build::bridge("src/ffi.rs")
  .std("c++20")
  .compile("example-bridge");
```

Now back to the `cxx_bindgen` stuff from the [previous article](/#/book/squavy/devlogs/synthesizer-architecture/preparing-the-synthesizer.md). CXX normally requires the developer to manually update this `ffi`-module, but I wouldn't be me if I wouldn't to automate this process. Here comes my library [`cxx_bindgen`](https://github.com/FabianHummel/cxx_bindgen) into play. It closely follows the style of `wasm_bindgen` to expose symbols, and automatically generates entries based on the symbol's signature. This means it also supports skipping specific symbols or automatically exporting all public symbols (fields and functions) within an exposed struct and much more.

`cxx_bindgen` integrates really nicely in the existing build pipeline by preceding the step from before with a code snippet to automatically generate the `ffi`-module:

```rust
cxx_bindgen_build::bridge("src/ffi.rs")
  .namespace("example")
  .generate();

cxx_build::bridge("src/ffi.rs")
  .std("c++20")
  .compile("example-bridge");
```

And that's it! This makes maintaining and adding new functionality to the synthesizer so much easier. If you are interested in learning how `cxx_bindgen` works behind the scenes I recommend reading up on [this article](/#/book/squavy/devlogs/explaining-cxx-bindgen.md), as it really wasn't a straightforward task to get working nicely.
