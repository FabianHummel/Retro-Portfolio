import { MusicItemProps } from "@components/shared/Songplayer";

function genSpectrum(): Array<number> {
    return Array.from({ length: 100 }, () => Math.random());
}

const MusicList: Array<MusicItemProps> = [
    {
        title: "Fresh Hands",
        song: "music/fresh-hands.wav",
        length: 79,
        spectrum: genSpectrum(),
        description: ""
    },
    {
        title: "Foxcub",
        song: "music/foxcub.wav",
        length: 91,
        spectrum: genSpectrum(),
        description: ""
    },

    {
        title: "Digital Overcome",
        song: "music/digital-overcome.wav",
        length: 64,
        spectrum: genSpectrum(),
        description: ""
    },

    {
        title: "Kuehlschrank",
        song: "music/kuehlschrank.wav",
        length: 142,
        spectrum: genSpectrum(),
        description: ""
    },

    {
        title: "Wasteland",
        song: "music/wasteland.wav",
        length: 144,
        spectrum: genSpectrum(),
        description: ""
    },

    {
        title: "G-Forces",
        song: "music/g-forces.wav",
        length: 185,
        spectrum: genSpectrum(),
        description: ""
    },

    {
        title: "Below Zero",
        song: "music/below-zero.wav",
        length: 210,
        spectrum: genSpectrum(),
        description: ""
    },

    {
        title: "Dreaming's End",
        song: "music/dreamings-end.wav",
        length: 102,
        spectrum: genSpectrum(),
        description: ""
    },
];

export default MusicList;
