import { createMousePosition } from "@solid-primitives/mouse";
import { createMemo, JSX, onCleanup, onMount } from "solid-js";
import backgroundVsh from "@components/home/background.vsh?raw";
import backgroundFsh from "@components/home/background.fsh?raw";
import clsx from "clsx";

export default function Background(props: JSX.HTMLAttributes<HTMLElement> & JSX.ImgHTMLAttributes<HTMLImageElement>) {

    const pos = createMousePosition(window);

    function sineSmoothstep(x) {
        if (x <= -1) return -1;
        if (x >= 1) return 1;
        return Math.sin((Math.PI / 2) * x);
    }

    const DEPTH_FACTOR = 5;

    // Konfigurierbarer Ursprung in Prozent (0.0 bis 1.0)
    const ORIGIN_X = 0.7; // 50% (Standard-Mitte)
    const ORIGIN_Y = 0.5; // 70% (Verschoben nach unten)

    const depthX = createMemo(() => {
        // Wandelt 0 bis 1 in -1 bis 1 um, zentriert um ORIGIN_X
        const normalizedX = (pos.x / window.innerWidth - ORIGIN_X) * 2;
        return DEPTH_FACTOR * sineSmoothstep(normalizedX);
    });

    const depthY = createMemo(() => {
        // Wandelt 0 bis 1 in -1 bis 1 um, zentriert um ORIGIN_Y
        const currentPercentY = (pos.y - window.scrollY) / window.innerHeight;
        const normalizedY = (currentPercentY - ORIGIN_Y) * 2;
        return DEPTH_FACTOR * sineSmoothstep(normalizedY);
    });

    let canvas!: HTMLCanvasElement;
    let gl!: WebGL2RenderingContext;
    let nextImageInterval!: number;

    let resizeObserver = new ResizeObserver(([entry]) => {
        canvas.width = entry.target.clientWidth;
        canvas.height = entry.target.clientHeight;

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    });

    onMount(() => {
        if (!canvas) return;
        gl = canvas.getContext("webgl2");
        if (!gl) console.error("WebGL2 not supported");
        resizeObserver.observe(canvas.parentElement);
        initPipeline();
    });

    onCleanup(() => {
        resizeObserver.disconnect();
        clearInterval(nextImageInterval);
    });

    function createShader(gl: WebGL2RenderingContext, type: number, source: string) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error(gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
        }
        return shader;
    }

    function createWebGLTexture(gl: WebGL2RenderingContext, imageElement: TexImageSource): WebGLTexture {
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);

        // Set parameters for standard non-power-of-two 2D images
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        // Upload pixel data directly to GPU memory
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imageElement);
        return texture;
    }

    let program!: WebGLProgram;
    let vao!: WebGLVertexArrayObject;

    let texCurrentBackground!: WebGLTexture;
    let texCurrentSubject!: WebGLTexture;
    let texNextBackground!: WebGLTexture;
    let texNextSubject!: WebGLTexture;
    let currentImageWidth = 1;
    let currentImageHeight = 1;
    let nextImageWidth = 1;
    let nextImageHeight = 1;

    let uTexCurrentBackgroundLoc!: WebGLUniformLocation;
    let uTexCurrentSubjectLoc!: WebGLUniformLocation;
    let uTexNextBackgroundLoc!: WebGLUniformLocation;
    let uTexNextSubjectLoc!: WebGLUniformLocation;
    let uProgressLoc!: WebGLUniformLocation;
    let uOffsetLoc!: WebGLUniformLocation;
    let uCanvasResolutionLoc!: WebGLUniformLocation;
    let uCurrentImageResolutionLoc!: WebGLUniformLocation;
    let uNextImageResolutionLoc!: WebGLUniformLocation;

    function initPipeline() {
        const vertexShader = createShader(gl, gl.VERTEX_SHADER, backgroundVsh);
        const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, backgroundFsh);

        program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        const positions = [
            -1, -1, 1, -1, -1, 1,
            -1, 1, 1, -1, 1, 1,
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

        vao = gl.createVertexArray();
        gl.bindVertexArray(vao);
        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

        uTexCurrentBackgroundLoc = gl.getUniformLocation(program, "u_texCurrentBackground");
        uTexCurrentSubjectLoc = gl.getUniformLocation(program, "u_texCurrentSubject");
        uTexNextBackgroundLoc = gl.getUniformLocation(program, "u_texNextBackground");
        uTexNextSubjectLoc = gl.getUniformLocation(program, "u_texNextSubject");
        uProgressLoc = gl.getUniformLocation(program, "u_progress");
        uOffsetLoc = gl.getUniformLocation(program, "u_offset");
        uCanvasResolutionLoc = gl.getUniformLocation(program, "u_canvasResolution");
        uCurrentImageResolutionLoc = gl.getUniformLocation(program, "u_currentImageResolution");
        uNextImageResolutionLoc = gl.getUniformLocation(program, "u_nextImageResolution");

        showNextImage();
        requestAnimationFrame(renderLoop);
    }

    function renderLoop() {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.useProgram(program);
        gl.bindVertexArray(vao);

        gl.uniform2f(uOffsetLoc, depthX(), depthY());
        gl.uniform1f(uProgressLoc, 0.0);
        gl.uniform2f(uCanvasResolutionLoc, gl.canvas.width, gl.canvas.height);
        gl.uniform2f(uCurrentImageResolutionLoc, currentImageWidth, currentImageHeight);
        gl.uniform2f(uNextImageResolutionLoc, nextImageWidth, nextImageHeight);

        // Assign the Textures to distinct hardware texture units on the GPU
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texCurrentBackground);
        gl.uniform1i(uTexCurrentBackgroundLoc, 0);

        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, texCurrentSubject);
        gl.uniform1i(uTexCurrentSubjectLoc, 1);

        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_2D, texNextBackground);
        gl.uniform1i(uTexNextBackgroundLoc, 2);

        gl.activeTexture(gl.TEXTURE3);
        gl.bindTexture(gl.TEXTURE_2D, texNextSubject);
        gl.uniform1i(uTexNextSubjectLoc, 3);

        // Draw the two triangles to render the output canvas
        gl.drawArrays(gl.TRIANGLES, 0, 6);

        requestAnimationFrame(renderLoop);
    }

    async function fetchImage(url: string): Promise<TexImageSource> {
        // 1. Fetch the raw binary data from the network
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to fetch image from ${url}: ${response.statusText}`);
        }

        const blob = await response.blob();

        // We specify {imageOrientation: 'none'} because we manually flipped Y in our vertex shader!
        const imageBitmap = await createImageBitmap(blob, {
            imageOrientation: 'none',
            premultiplyAlpha: 'none'
        });

        return imageBitmap;
    }

    async function showNextImage() {
        try {
            {
                const image = await fetchImage("/img/home/Fabi Fursuit_background.webp");
                texCurrentBackground = createWebGLTexture(gl, image);
                currentImageWidth = image.width;
                currentImageHeight = image.height;
            }
            {
                const image = await fetchImage("/img/home/Fabi Fursuit_subject.webp");
                texCurrentSubject = createWebGLTexture(gl, image);
            }
        }
        finally {
            nextImageInterval = setTimeout(showNextImage, 5000);
        }
    }

    return <>
        <img {...props} src="/img/home/Fabi Fursuit_background.webp" style={{
            translate: `${depthX()}px ${depthY()}px`
        }} />
        <img {...props} src="/img/home/Fabi Fursuit_subject.webp" style={{
            translate: `${-depthX()}px ${-depthY()}px`
        }} />

        {/*<canvas {...props} ref={canvas} />*/}
    </>
}
