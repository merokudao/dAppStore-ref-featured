import { useRouter } from "next/router";
import { PageLayout } from "../../components";
import { ReviewCard } from "../../components/card";
import { Column, Row } from "../../components/layout/flex";
import { useGetAppRatingQuery } from "../../features/dapp/dapp_api";
import { AppStrings } from "../constants";

function RatingAndReviewPage(props) {
	const router = useRouter();
	const { data, isLoading, isFetching } = useGetAppRatingQuery(
		router.query.id
	);
	if (isLoading || isFetching) return null;
	// if (data && data.data.length === 0) return null;
	let reviewList;
	if (!data.data.length) {
		reviewList = <p>No reviews found</p>;
	} else {
		reviewList = data.data.map((review) => <ReviewCard review={review} />);
	}
	return (
		<PageLayout>
			<div className="mb-6 cursor-pointer" onClick={router.back}>
				<svg
					className="inline-block mr-2"
					width="24"
					height="24"
					viewBox="0 0 25 26"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M12 19.5001L5 12.5001M5 12.5001L12 5.50012M5 12.5001H19"
						stroke="#E2E1E6"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
				<span className="text-2xl">{AppStrings.back}</span>
			</div>
			<Row className="justify-between items-center py-[24px]">
				<h1 className="text-[24px] leading-[32px] font-[500]">
					{AppStrings.reviewsTitle}
				</h1>
				<button
					className="flex  items-center gap-x-[8px] text-transparent bg-clip-text bg-gradient-to-b from-[#8A46FF] to-[#6E38CC] font-bold text-[14px] leading-[18px]"
					onClick={props.onCreateReivew}
				>
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z"
							stroke="url(#paint0_linear_1089_2333)"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
						<defs>
							<linearGradient
								id="paint0_linear_1089_2333"
								x1="12.0607"
								y1="1.87869"
								x2="12.0607"
								y2="22"
								gradientUnits="userSpaceOnUse"
							>
								<stop stopColor="#8A46FF" />
								<stop offset="1" stopColor="#6E38CC" />
							</linearGradient>
						</defs>
					</svg>
					Add review
				</button>
			</Row>
			<Column className="gap-y-[16px]">{reviewList}</Column>
		</PageLayout>
	);
}

export default RatingAndReviewPage;
