/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	optimizeFonts: false,
	theme: {
		extend: {
			fontFamily: {
				sans: ["var(--font-sans)"],
				mono: ["var(--font-mono)"],
			},
			container: {
				center: true,
				padding: {
					DEFAULT: "1rem",
					sm: "1rem",
					lg: "1rem",
					xl: "5rem",
					"2xl": "6rem",
				},
			},
			backgroundImage: {
				"card-bg": "linear-gradient(180deg, #141217 0%, #0E0C12 100%);",
			},
			borderRadius: {
				"card-radius": "12px",
			},
			colors: {
				"text-color": "#ffffff",
				"nav-color": "#0a090d",
				"border-color": "#2D2C33",
				"canvas-color": "#07070B",
			},
			fontSize: {
				"4xl": ["2rem", "120%"],
				"5xl": ["2.625rem", "114%"],
			},
		},
	},
	plugins: [],
};
