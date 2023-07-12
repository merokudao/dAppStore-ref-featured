import ScrollToTopButton from "../../components/scroll_to_top";
import CategoriesList from "../categories";

export default function SearchPage() {
	return (
		<>
			<CategoriesList title={"Search Result"} />
			<ScrollToTopButton />
		</>
	);
}
