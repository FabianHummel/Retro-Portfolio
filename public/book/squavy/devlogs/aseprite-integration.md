# Integrating Aseprite into Vite

Squavy uses **LOTS** of pixel-art sprites for most of its components, whether its for buttons, list items, backgrounds, borders, panels, *you name it...*

Before [Squavy's redesign](/#/book/squavy/history/squavy.md), we didn't have a specific way to texture individual sprites. Some of us used Paint.net, others used Krita or even Photoshop - It was a complete mess. However, probably the worst thing was that individual layers or effects of them sprites could not be modified once they were flattened to a PNG or GIF. This was a constant problem and caused textures to loose quality, because we were often too lazy to save the sprite's project files somewhere.

*If there wasn't a simpler way to unify sprite creation and rendering...* I thought about the problem for a bit and remembered that Aseprite had a command line interface for exporting images. This could be used to automate the process of flattening the sprites and save us a lot of work each time we would modify an image. First I thought I'd use a Javascript file for iterating over all Aseprite files and placing the generated images into a folder, where we would reference them from the HTML, but I had an even better idea:

## Vite Plugin

See, Vite supports plugins that were capable of dynamically changing parts of the resulting HTML based on some input. So I wrote a small piece of code that would lazily invoke Aseprite whenever Vite wanted to provide an image URL to the browser and instead supply the flattened PNG as a Base64 string:

```typescript
function viteAseprite(): PluginOption {
    const aseFilter = createFilter('**/*.aseprite');

    return { name: "vite-plugin-aseprite", load(id) {
        if (!aseFilter(id)) return;
        const outDir = tmpdir();
        execSync(`${env.VITE_ASEPRITE} -b "${id}" --play-subtags --save-as ${outDir}/out.gif`);
        const data = readFileSync(`${outDir}/out.gif`);
        unlinkSync(`${outDir}/out.gif`);

        return { code: 
            `const src = "data:image/gif;base64,${data.toString("base64")}";` +
            `export {src as default,duration};` }
    }};
}
```

```tsx
export * as EditButton from "./assets/edit.aseprite";

// PixelImage is just a wrapper around <img/>, and contains adaptions for Squavy.
return <PixelImage src={EditButton} />
```

In fact, I could also directly export the file as an animated GIF, which massively cuts down time on manual exporting. And the result speaks for itself - it worked *really, really*, well. Even live changes to the Aseprite file were supported most of the time.

Also note the use of the environment variable to the Aseprite binary. Each user has a different path to Aseprite, some may have downloaded it through Steam, some may have it lying around in their Downloads folder. Using the `.env.local` file, Vite can laod environment variables that are private to each user and is hidden from the source repository, which is also going to be really useful once we [Dockerize Squavy](/#/book/squavy/devlogs/dockerizing-squavy.md).

# CSS Support

There was still a small problem remaining: The plugin I showed above only worked for HTML-image tags, but not by using a CSS-`url(...)`. Lucky for us, Vite also supports PostCSS-plugins, so I quickly hacked this together, which is essentially the same code, but layed out for CSS-based images like background or border images:

```typescript
function postCssAseprite(): AcceptedPlugin {
    const regex = /(?<=url\(["']).*\.(aseprite)(?=["']\))/;

    return { postcssPlugin: "postcss-plugin-aseprite", Once(root) {
        root.walkDecls(decl => {
            const matches = decl.value.match(regex);
            let url = matches[0];
            if (url.startsWith('/')) url = path.resolve(process.cwd(), url.substring(1));

            const outDir = tmpdir();
            execSync(`${env.VITE_ASEPRITE} -b "${url}" --play-subtags --save-as ${outDir}/out.gif`);
            const base64 = readFileSync(`${outDir}/out.gif`, "base64");
            unlinkSync(`${outDir}/out.gif`);
            
            decl.value = `url(data:image/gif;base64,${base64})`;
        });
    }}
}
```
