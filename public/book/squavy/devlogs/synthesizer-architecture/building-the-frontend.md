# Building the Frontend

The program still needs a nice frontend where the user can manage browser connections and external audio plugins. For that I could create a cross-platform UI, but I thought it would be nice to give each system its own unique client. For this small size of a program it's fine to maintain three frontends all by myself and I get to know some more technologies along the way.

For this article, I will mainly focus on the macOS implementation as that's the one I am actively developing at this time, but Windows and Linux specific implementations will follow some day.

## C++ ↔ Objective C

While I am sure there are dozens of different ways and tutorials how to enable communication between C++ and Swift, I will explain how I managed to solve this problem myself.

The shared C++ code has some endpoints that the frontend needs to interact with, such as the program's active state (on, off), managing a list of connected clients (browser tabs with Squavy running), a way to discover, manage and interact with external plugins, and much more.

The problem with macOS modern application language Swift is that it doesn't really integrate well with other language and often requires a third party to bridge the gap. For direct communication between Swift and C++ this would be Objective C. Sounds painful, and that's because it is.

Similar to connecting Rust with C++, we define a language boundary once again, but this time on the C++ side ([`ffi.h`](https://github.com/Squavy-DAW/Squidge/blob/main/shared/ffi.h)). In order to make this boundary cross-platform compatible, we also need to add some C preprocessor shenanigans:

```c++
#if defined(_WIN32) || defined(_WIN64)
#if defined(SQUIDGE_EXPORTS)
#define SQUIDGE_API __declspec(dllexport)
#else
#define SQUIDGE_API __declspec(dllimport)
#endif
#else
#define SQUIDGE_API __attribute__((visibility("default")))
#endif

#ifdef __cplusplus
extern "C"
{
#endif

    SQUIDGE_API void squidge_init(void);

    // remaining FFI bindings ...

#ifdef __cplusplus
}
#endif
```

The `SQUIDGE_API` directive marks the function as exported to the other side, in our case Objective C - I will elaborate this shortly. We also differentiate between bindings that are called from Swift → C++ and vice versa. C++ functions that are called from Swift can be invoked directly and look like the function defined in the code snippet above. However, if we want to call Swift (or the client's specific frontend language), we need to configure a callback that the frontend hooks into on application startup:

```c++
typedef std::function<void(const void *handle)> ClientConnectedCallback;

SQUIDGE_API void squidge_register_client_connected_callback(const ClientConnectedCallback &callback);
```

## Objective C ↔ Swift

In the Xcode project, we must define a special type of file, the [`Squidge-Bridging-Header.h`](https://github.com/Squavy-DAW/Squidge/blob/main/osx/Squidge/Squidge-Bridging-Header.h). This file allows us to define the language boundry between Swift and Objective C, as this sort of communication is also not directly supported. In the Squidge codebase, I outsourced the contents of the bridging header to a [`Wrapper.h`](https://github.com/Squavy-DAW/Squidge/blob/main/osx/Squidge/Wrapper.h) together with the implementation [`Wrapper.mm`](https://github.com/Squavy-DAW/Squidge/blob/main/osx/Squidge/Wrapper.mm) using an include directive. These files contain similar function definitions that are also found in the [`ffi.h`](https://github.com/Squavy-DAW/Squidge/blob/main/shared/ffi.h) file, with some changes to convert things like C-strings to Swift's native string types or array conversions (see example below).

```objc
#ifdef __cplusplus
#include "ffi.h"
#endif

typedef void (^PluginActivatedCallbackObjC)(const void* handle, NSString* id);

- (void)registerPluginActivatedCallback: (PluginActivatedCallbackObjC)callback;

// remaining FFI bindings...
```

```objc
- (void)registerPluginActivatedCallback: (PluginActivatedCallbackObjC)callback
{
    // register a C++ callback with an Objective C handler that calls the Swift function:
    squidge_register_plugin_activated([callback](const void* handle, const char* id) {
        // convert a C-string to a `NSString`
        callback(handle, [NSString stringWithUTF8String:id]);
    });
}
```

On startup, the Swift code then registers this callback by invoking the function defined in Objective C:

```swift
squidge.registerPluginActivatedCallback { [weak self] handle, id in
    DispatchQueue.main.async {
        // add the external plugin to the frontend's list to show it in a list
    }
}
```

## Final words

Sure it's not the ideal way, but it works pretty good, but sacrifices readability and maintenance for low runtime overhead. It's especially tedious to add or modify the language boundary, as it involves changing code in three different languages and is fairly limited on which types of data is even able to be passed over the bridge. I am always open for suggestions on how to improve things like this.

*Aaaaand that's it!* This is how I integrated native, external audio plugins into Squavy, a digital audio workstation operating fully *(well, not anymore)* in the browser. By creating Squidge, I learned several skills that generally improved me as a full-stack developer:

 - How to performantly synthesize real-time audio within the browser using Rust and WebAssembly.
 - How to design a Rust library that is cross-compilable to WebAssembly and to a native binary.
 - How to combine Rust and C++ code through the help of very cool technologies such as CXX and Corrosion (and even my own little tool).
 - How to combine C++ and Swift over a shared Objective C bridge to create individual frontends for each operating system.

All in all, I had so much fun exploring all of these different parts and I can't describe how good it feels to see all of these individual gears work together in the final program like a clockwork. Of course there is always room for improvement and potential to simplify things, but it's cool as hell the way it works right now ;)