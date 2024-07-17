import {PixelImage} from "@components/shared/PixelImage";

interface VolumeIconProps {
    volume: number;
}

export default function VolumeIcon(props: VolumeIconProps) {
    return (
        <PixelImage w={10} h={8} scale={3} alt={"Volume indicator"} src={
            props.volume == 0
                ? "/img/music/muted.png"
            : props.volume < 0.5
                ? "/img/music/silent.png"
                : "/img/music/loud.png"
        } />
    )
}