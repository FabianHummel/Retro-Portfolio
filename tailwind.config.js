const plugin = require('tailwindcss/plugin')

module.exports = {
	mode: 'jit',
	content: [
		'./index.html',
		'./src/**/*.{js,ts,jsx,tsx,css,md,mdx,html,json,scss}',
	],
	darkMode: 'class',
	plugins: [
		plugin(function ({ addVariant }) {
			[
				addVariant('not-last', '&:not(:last-child)'),
				addVariant('not-first', '&:not(:first-child)')
			]
		})
	],
	theme: {
		extend: {
			keyframes: {
				'push': {
					'0%, 100%': { 'transform': 'translateY(0px)' },
					'30%': { 'transform': 'translateY(10px)' },
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

				'keyscale': {
					'0%': {
						'width': '0px',
						'transform': 'translateX(32px)'
					},
					'100%': {
						'width': '64px',
						'transform': 'translateX(0px)'
					}
				},

				'firstkeyscale': {
					'0%': {
						'width': '0px',
					},
					'100%': {
						'width': '64px',
					}
				},

				'keyin': {
					'0%': { 'transform': 'translateY(40px)' },
					'100%': { 'transform': 'translateY(0px)' }
				},

				'pwcorrect': {
					'0%': { 'height': '8rem', 'opacity': 1 },
					'100%': { 'height': 0, 'opacity': 0 }
				},

				'pwincorrect': {
					'0%': { 'transform': 'translateX(0px)' },
					'10%': { 'transform': 'translateX(10px)' },
					'20%': { 'transform': 'translateX(-10px)' },
					'30%': { 'transform': 'translateX(10px)' },
					'40%': { 'transform': 'translateX(-10px)' },
					'50%': { 'transform': 'translateX(10px)' },
					'60%': { 'transform': 'translateX(0px)' },
					'80%': { 'height': '8rem', 'opacity': 1 },
					'100%': { 'height': 0, 'opacity': 0 }
				},
			},
			animation: {
				'push': 'push 2s ease infinite',
				'scroll': 'svglinescroll 1s linear infinite',
				'playing': 'musicplaying 0.6s linear infinite alternate',
				'spin': 'spin 45s linear infinite',

				'keyscale': 'keyscale 0.2s ease-out forwards',
				'firstkeyscale': 'firstkeyscale 0.2s ease-out forwards',
				'keyin': 'keyin 0.2s ease-out forwards',
				'pwcorrect': 'pwcorrect 0.3s ease-in 1s',
				'pwincorrect': 'pwincorrect 1s ease-in-out 1s',
			},
		},
		fontFamily: {
			'main': ["bitmirror", "sans-serif"],
		},
		colors: {
			'white': 'rgb(245, 245, 245)',
			'gray': 'rgb(205, 205, 205)',
			'black': 'rgb(40, 40, 40)',
			'light': 'rgb(235, 235, 235)',
		},
		fontSize: {
			'l': '2.3rem',
			'm': '1.8rem',
			's': '1.5rem',
		},
	}
};