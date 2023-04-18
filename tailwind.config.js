module.exports = {
	mode: 'jit',
	content: [
		'./index.html',
		'./src/**/*.{js,ts,jsx,tsx,css,md,mdx,html,json,scss}',
	],
	darkMode: 'class',
	theme: {
		extend: {
			keyframes: {
				'push': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'30%': { transform: 'translateY(10px)' },
				},

				'svglinescroll': {
					'0%': { 'stroke-dashoffset': 16 },
					'100%': { 'stroke-dashoffset': 0 }
				},

				'musicplaying': {
					'0%': { 'transform': 'rotate(-10deg) translateY(3px) translateX(-3px)' },
					'50%': { 'transform': 'rotate(0deg) translateY(0px)' },
					'100%': { 'transform': 'rotate(10deg) translateY(3px) translateX(3px)' }
				},

				'spin': {
					'0%': { 'transform': 'rotate(0deg)' },
					'100%': { 'transform': 'rotate(360deg)' }
				},
			},
			animation: {
				'push': 'push 2s ease infinite',
				'scroll': 'svglinescroll 1s linear infinite',
				'playing': 'musicplaying 0.6s linear infinite alternate',
				'spin': 'spin 45s linear infinite'
			}
		},
		fontFamily: {
			'main': ["bitmirror", "sans-serif"],
		},
		colors: {
			'white': 'rgb(245, 245, 245)',
			'gray': 'rgb(217, 217, 217)',
			'black': 'rgb(40, 40, 40)',
		},
		fontSize: {
			'l': '2.3rem',
			'm': '1.8rem',
			's': '1.5rem',
		}
	}
};