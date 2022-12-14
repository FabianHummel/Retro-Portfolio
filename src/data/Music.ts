import { MusicItemProps } from "../components/music/MusicItem";

function genSpectrum(): Array<number> {
	return Array.from({ length: 100 }, () => Math.random());
}

const MusicList : Array<MusicItemProps> = [
	{
		title: "1. Fresh Hands",
		song: "music/fresh-hands.wav",
		length: 79,
		spectrum: genSpectrum(),
		description: ""
	},
	{
		title: "2. Foxcub",
		song: "music/foxcub.wav",
		length: 91,
		spectrum: genSpectrum(),
		description: ""
	},

	{
		title: "3. Digital Overcome",
		song: "music/digital-overcome.wav",
		length: 64,
		spectrum: genSpectrum(),
		description: ""
	},

	{
		title: "4. Wasteland",
		song: "music/wasteland.wav",
		length: 144,
		spectrum: genSpectrum(),
		description: ""
	},

	{
		title: "5. G-Forces",
		song: "music/g-forces.wav",
		length: 185,
		spectrum: genSpectrum(),
		description: ""
	},

	{
		title: "6. Below Zero",
		song: "music/below-zero.wav",
		length: 210,
		spectrum: genSpectrum(),
		description: ""
	},

	{
		title: "7. Dreaming's End",
		song: "music/dreamings-end.wav",
		length: 102,
		spectrum: genSpectrum(),
		description: ""
	},
];

export default MusicList;