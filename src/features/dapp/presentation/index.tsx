import { Card } from "../../../components";
import { useGetDappListQuery } from "../dapp_api";
import { Dapp } from "../models/dapp";
import { Review } from "../models/review";

export const FeaturedList = () => {
	return (
		<>
			<h1>FeaturedList</h1>
		</>
	);
};

export const ReviewListTile = ({ review }: { review: Review }) => {
	return (
		<li>
			{review.dappId}
			{review.rating}
			{review.comment}
		</li>
	);
};

export const DappList = () => {
	const { data, isFetching, isLoading } = useGetDappListQuery(
		{
			page: 1,
			limit: 20,
		},
		{
			refetchOnMountOrArgChange: false,
		}
	);

	if (isLoading) return <div>Loading...</div>;
	if (!data) return <div>Missing post!</div>;

	return (
		<div>
			{data.response.map((app: Dapp) => (
				<Card key={app.dappId} app={app} />
			))}
		</div>
	);
};
