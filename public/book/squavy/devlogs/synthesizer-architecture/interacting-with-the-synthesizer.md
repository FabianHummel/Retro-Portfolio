# Interacting with the synthesizer

Because the synthesizer lives in a dedicated audio thread, we also need a way to communicate with it from the main thread. I solved this problem by automatically generating bindings that would send and receive messages between the two threads using the `MessageChannel` API.

The communication then runs over *synthesizer commands*, which makes it trivial to synchronize the frontend state with the synthesizer's internal datastructure. For example, the command `add-instrument-pattern` would accept the parameters `id`, `instrument-id` `pattern-id`, `start` and `end`. Then, the Javascript facade calls the respective synthesizer function `add_instrument_pattern(id: String, instrument_id: String, pattern_id: String, start: f64, end: f64);`.

In the Solid.js frontend, every time the synthesizer structure changes, the required commands are sent to the synthesizer to synchronize the changes:

```typescript
createEffect(() => {
    const diff = getDiff(previous, projectData) as DeepPartial<ProjectData>;
    previous = JSON.parse(JSON.stringify(projectData));

    if (diff.tracks) synchronizeTracks(diff.tracks);
    if (diff.patterns) synchronizePatterns(diff.patterns);
});

// Example synchronization of the synthesizer tracks (individual instruments)
function synchronizeTracks(tracks: DeepPartial<ProjectData["tracks"]>) {
    for (const [trackId, track] of Object.entries(tracks)) {
        // Delete if removed
        if (track === undefined) {
            console.debug("Removing instrument", trackId);
            synthesizer.removeInstrument(trackId);
            continue;
        }
        // Create if added
        if (track.default !== undefined) {
            console.debug("Adding instrument", trackId);
            synthesizer.addInstrument(trackId);
        }
        // Repeat for children
        if (track.patterns !== undefined) {
            synchronizeTimedPatterns(trackId, track.patterns);
        }
        // Repeat for children
        if (track.instrument !== undefined && track.instrument.nodes !== undefined) {
            synchronizeNodes(trackId, track.instrument.nodes);
        }
    }
}
```

The order of synchronization is really important here:

1. If the datum is explicitly undefined, it means it was removed from the changeset
2. If the `default` property is set (which is **ONLY** set for new objects, it doesn't change anymore after initial creation), it means the datum was added to the changeset.
3. For child properties (like `patterns` and `nodes` in this case), call the synchronization function on them as well, which repeats the process for the containing children.

The utility for automatically creating the bindings to the synthesizer is pretty complex and involves analysing the generated bindings from `wasm_bindgen` to forward the calls. However, it can be looked up [here](https://github.com/Squavy-DAW/Squavy/blob/dev/packages/synth/tools/generate-bindings.js) once Squavy and its source goes live.