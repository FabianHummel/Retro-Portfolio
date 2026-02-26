# The return of the Web Audio API

Luckily for us, the Web Audio API provides a way to create custom audio nodes using the `ScriptProcessorNode` (deprecated) or the much newer `AudioWorkletNode`. These nodes expose a trivial API to porcess audio in real time, namely through the `process()` function. Normally, this function contains pure Javascript code to do the processing, but we have a web assembly instead. How do we glue these two together?

It's important to know that the audio worklet runs in a dedicated worker thread called the `AudioWorkletGlobalScope`, which essentially is just a stripped down version the normal Javascript environment you'd find in any browser console and is tailored to audio processing. Luckily for us, it does have the ability to run web assembly code, so simply importing and hooking up the process-function with our own `synthesize`-function should be trivial, right? *Right?*

Well, what would life be without problems? The audio scope does not support import directives, which makes including the web assembly difficult. However, I could use the built-in message channels to send over the assembly from the main thread to the audio worklet during initialization:

```typescript
// Import the web assembly by a fetch-URL
import wasmUrl from '../pkg/synth_bg.wasm?url';

// Import the Javascript bindings as a raw string
import bindgen from "../pkg/synth.js?raw";

// Import the audio processor
import SmseProcessor from './smse-processor.js?raw';

const smseProcessorUrl = URL.createObjectURL(new Blob(
    [bindgen + SmseProcessor],
    { type: "application/javascript" }));

// Register the audio worklet
await this._audioContext.audioWorklet.addModule(smseProcessorUrl);

smseWasmCode = await fetch(wasmUrl).then(response => response.arrayBuffer());

this._node = new AudioWorkletNode(this._audioContext, 'smse-processor', {
    outputChannelCount: [2],
});

// Wait for receiving an ackowledgement upon sending the assembly.
await new Promise(resolve => {
    const channel = new MessageChannel();
    channel.port1.onmessage = resolve;
    this._node.port.postMessage(smseWasmCode, [channel.port2]);
});
```

However, on the receiving end, the next problem was already waiting for me. When the audio processor tried to instantiate the assembly, it would crash while trying to use the `TextDecoder` class, which is not available in the global audio worklet scope:

```javascript
const module = await WebAssembly.compile(wasm);
const mod = await __wbg_load(module, __wbg_get_imports());
// Uncaught (in promise) Error: TextDecoder not available
__wbg_finalize_init(mod.instance, mod.module);
init();
```

Lucky for me, there is a workaround for this problem as well that includes downloading a small polyfill for the missing classes TextEncoder and TextDecoder written by *Viktor Mukhachev*. This polyfill is simply concatenated to the rest of the audio processor's Javascript like this:

```typescript
const smseProcessorUrl = URL.createObjectURL(new Blob(
    [polyfill + bindgen + SmseProcessor],
    { type: "application/javascript" }));
```