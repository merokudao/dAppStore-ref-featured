import { Head, Html, Main, NextScript } from "next/document";
import { generalSans } from "../theme";

export default function Document() {
	return (
		<Html
			className={`bg-canvas-color text-text-color ${generalSans.className}`}
		>
			<Head />
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
