import { PixelImage } from "@components/shared/PixelImage";
import { splitProps } from "solid-js";
import type { JSX } from "solid-js/jsx-runtime";

interface VolumeIconProps extends JSX.HTMLAttributes<HTMLImageElement> {
    volume: number;
}

export default function VolumeIcon(props: VolumeIconProps) {
    const [local, other] = splitProps(props, ["volume"]);

    return (
        <PixelImage {...other} w={10} h={8} scale={3} alt={"Volume indicator"} src={
            local.volume === 0
                ? "/img/music/muted.png"
                : local.volume < 0.5
                    ? "/img/music/silent.png"
                    : "/img/music/loud.png"
        } darkSrc={
            local.volume === 0
                ? "/img/music/muted Dark.png"
                : local.volume < 0.5
                    ? "/img/music/silent Dark.png"
                    : "/img/music/loud Dark.png"
        } />
    )
}
