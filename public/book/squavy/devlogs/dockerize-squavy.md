# Dockerizing Squavy

<!-- TODO: Introduction -->

*Disclaimer: The majority of this content is taken from our [diploma thesis](/#/book/squavy/diploma-thesis.pdf) and is slightly adapted to the article.*

To begin with, let's start with creating a `Dockerfile` in Squavy's root folder. I started by selecting a base image from Dockerhub - here we have used a rust-based image because it already comes with some essential tools that we need for building Squavy's web frontend and synthesizer:

```dockerfile
FROM rust:slim-bookworm AS synth-rust
```

Squavy requires the synthesizer dependency to build successfully, which is developed in a separate repository. The folder containing the synthesizer's code needs to be on the same level as our main project for Docker to find it. However, this is not so easily done in an isolated container, which is why we need to clone the repository within the build pipline itself. Authentication runs via an ssh-key as of March 2024. However, later as the repository will be made available to the public, the access will work through https, so a git deploy key will not be necessary anymore:

```dockerfile
RUN apt-get update && apt-get install -y git openssh-client
COPY id_rsa /root/.ssh/id_rsa
RUN chmod 600 /root/.ssh/id_rsa
RUN ssh-keyscan github.com >> /root/.ssh/known_hosts

RUN git clone git@github.com:Squavy-DAW/Synth.git /Synth
WORKDIR /Synth
RUN cargo install wasm-pack
RUN wasm-pack build --target web
```

After installing other essential dependencies for the project, we start a multi-stage build to run the Synth and make it available for Squavy:

```dockerfile
FROM node:22-bullseye AS synth-javascript
COPY --from=synth-rust /Synth /Synth
WORKDIR /Synth
RUN npm install && npm run build
```

## Building Aseprite from Source (within Docker)

The next step is to build Aseprite, an essential development tool for Squavy's user interface. Initially, we had to export the created designs from our Aseprite project into other formats like `PNG` and `GIF` to be able to use them in our project. This was not very efficient though, because at the smallest mistake or redo you needed to update the file and repeat the whole process of manually exporting and converting it again. More information about how I fixed this issue by integrating Aseprite into our development environment can be read in [this article](/#/book/squavy/devlogs/aseprite-integration.md).

The Aseprite plugin complicates the building process, because Docker does not have a way to use Aseprite when building the frontend. A solution to this problem is to build the program from source all within the Docker pipeline and use the compiled binary there. Hereby, we need to exclude Aseprite's frontend because it is not required for the command line interface to function properly. Although building the tool from source significantly increases build time due to its many dependencies, Docker caches the steps after the first run and therefore minimizes repeated delays:

```dockerfile
FROM debian:bookworm-slim AS aseprite
RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install -y git unzip curl build-essential cmake \
                       ninja-build libxll-dev libxcursor-dev \
                       libxi-dev libgll-mesa-dev libfontconfig1-dev

RUN git clone -b v1.3.13 --recursive --shallow-submodules --depth 1 \
    https://github.com/aseprite/aseprite.git /aseprite
WORKDIR /aseprite
RUN mkdir build
WORKDIR /aseprite/build
RUN cmake \
  -DCMAKEBUILDTYPE=RelWithDebInfo \
  -DLAFBACKEND=none \
  -G Ninja
  # some more flags...
RUN ninja aseprite
```

Just like in our local development environment, we can now set the path to the Aseprite binary in the `.env.local` file and Squavy builds with no problems :)

