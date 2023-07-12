import { Space_Mono } from "next/font/google";
import localFont from "next/font/local";

export const generalSans = localFont({
	src: [
		{
			path: "../../public/assets/fonts/GeneralSans/GeneralSans-Regular.ttf",
			weight: "400",
			style: "normal",
		},
		{
			path: "../../public/assets/fonts/GeneralSans/GeneralSans-Medium.ttf",
			weight: "500",
			style: "normal",
		},
		{
			path: "../../public/assets/fonts/GeneralSans/GeneralSans-Bold.ttf",
			weight: "800",
			style: "normal",
		},
	],
	display: "swap",
	fallback: ["system-ui"],
	variable: "--font-sans",
});

export const spaceMono = Space_Mono({
	subsets: ["latin"],
	weight: "400",
	display: "swap",
});
