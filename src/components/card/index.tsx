import Image from "next/image";
import { StarRating } from "../../pages/dapp";
import { Tag } from "../app_list";
import { Row } from "../layout/flex";

export const Card = (props) => {
	return (
		<div
			className={
				"card p-4 w-full h-full bg-card-bg border border-gray-700 rounded-card-radius " +
				props.className
			}
		>
			{props.children}
		</div>
	);
};

export function SliderButton(props) {
	return (
		<button className="w-[52px] h-[52px]" {...props}>
			{props.children}
		</button>
	);
}

export function FeaturedCard(props) {
	const { app } = props;
	return (
		<div
			style={{ backgroundImage: `url(${app.images?.banner})` }}
			className="relative h-[240px] lg:h-[320px] rounded-lg bg-cover bg-no-repeat bg-center border-[1px] border-[#FFFFFF66] overflow-hidden"
		>
			<div className="absolute inset-0 bg-gradient-to-b from-[#0000003D] to-[#000000CC]" />
			<div className="absolute backdrop-blur-lg w-[80px] h-[80px] rounded-[8px] top-[16px] left-[16px]" />
			<div className="absolute top-[24px] left-[24px] w-[64px] h-[64px] rounded-[8px] overflow-hidden">
				<Image fill src={app.images.logo} alt="" />
			</div>
			<div className="absolute bottom-[24px] left-[24px]">
				<p className="text-[16px] leading-[18px] lg:text-[24px] lg:leading-[28px] font-[500] line-clamp-1 mb-[8px]">
					{app.name}
				</p>
				<Row className="gap-x-[4px]">
					{app.tags?.length ? (
						app.tags?.slice(0, 3).map((e) => <Tag>{e}</Tag>)
					) : (
						<br />
					)}
				</Row>
			</div>
		</div>
	);
}

export function ReviewCard(props) {
	const { review } = props;
	const date = new Date(Date.parse(review.updatedAt));
	return (
		<Card className="h-auto">
			<Row className="justify-between">
				<p>
					{review.userId}
					<span className="text-[#87868C]">
						&#x2022;{" "}
						{`${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`}
					</span>
				</p>
				<StarRating rating={review.rating} />
			</Row>
			<p className="text-[14px] leading-[21px] font-[500] text-[#87868C]">
				{review.comment}
			</p>
		</Card>
	);
}
