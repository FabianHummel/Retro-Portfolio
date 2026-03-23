# Marrying Rust and CMake

We now have a C++ library that is able to interact with our Rust synthesizer, but we don't yet have a way to actually use it anywhere.

The best option would be to integrate all of this into CMake of course, as it allows all necessary build steps to be placed in the same location and requires the least amount of manual setup to get everything up and running.

To our advantage, there is a library that allows adding CXX libraries *(amongst others)* to a CMake project and use it in a C++ codebase like any ordinary library - [Corrosion](https://corrosion-rs.github.io/corrosion/)!

> Corrosion, *formerly known as cmake-cargo*, is a tool for integrating Rust into an existing CMake project. Corrosion can automatically import executables, static libraries, and dynamic libraries from a workspace or package manifest (`Cargo.toml` file).

Even though [FFi binding integration with CXX](https://corrosion-rs.github.io/corrosion/ffi_bindings.html#cxx-integration) is experimental, I happen to find it working quite well and never experienced any issues:

```cmake
corrosion_import_crate(
    MANIFEST_PATH ../Synth/Cargo.toml
    FEATURES cxx)

corrosion_add_cxxbridge(synth-bridge
    CRATE smse
    FILES ffi.rs)
```

In the C++ code, we simply invoke the synthesizer commands when a message is received:

```cpp
else if (msg.type == "update-oscillator-frequency") {
  instance->synth->update_oscillator_frequency(
    ::rust::String(msg.data["id"]),
    ::rust::String(msg.data["instrument_id"]),
    msg.data["value"]);
}
```

More about the actual logic of the native client application and how it integrates with Squavy is described in the next article. I promise it's worth the time if you managed to read until here :)