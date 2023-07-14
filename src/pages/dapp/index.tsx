import { useConnectModal } from "@rainbow-me/rainbowkit";
import classNames from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import { useSelector } from "react-redux";
import { useAccount } from "wagmi";
import { BASE_URL, HOST_URL } from "../../api/constants";
import {
	Button,
	ClaimButton,
	ExpandAbleText,
	RImage as Image,
	PageLayout,
} from "../../components";
import { ReviewCard } from "../../components/card";
import { Column, Row } from "../../components/layout/flex";
import { getApp } from "../../features/app/app_slice";
import { merokuToCustomCategory } from "../../features/categories";
import {
	useGetAppRatingQuery,
	useGetBuildDownloadUrlQuery,
	useGetDappByOwnerAddressQuery,
	usePostReviewMutation,
} from "../../features/dapp/dapp_api";
import { Dapp } from "../../features/dapp/models/dapp";
import { Review } from "../../features/dapp/models/review";
import { useSearchByIdQuery } from "../../features/search";
import { AppStrings } from "../constants";

Modal.setAppElement("#__next");

// dapp page, shows complete dapp info
const modalStyles = {
	overlay: {
		background: "rgba(0,0,0,0.80)",
	},
	content: {
		padding: 0,
		top: "80px",
		border: 0,
		background: "transparent",
	},
};

const reviewModalStyle = {
	overlay: {
		background: "rgba(0,0,0,0.7)",
	},
	content: {
		padding: "24px",
		top: "calc(50% - (30vw / 2))",
		border: 0,
		width: "512px",
		height: "512px",
		margin: "0 auto",
		background: "#141318",
		borderRadius: "16px",
	},
};

function Divider(props) {
	return <div className="h-[1px] bg-[#2D2C33]" />;
}

function SocialButton(props) {
	return (
		<div className="bg-[#212026] p-4 rounded-lg cursor-pointer">
			<svg
				width="25"
				height="21"
				viewBox="0 0 25 21"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M24.5898 2.34187C23.6898 2.80341 22.7898 2.95726 21.7398 3.1111C22.7898 2.49572 23.5398 1.57264 23.8398 0.341872C22.9398 0.957256 21.8898 1.26495 20.6898 1.57264C19.7898 0.649564 18.4398 0.0341797 17.0898 0.0341797C13.9398 0.0341797 11.5398 3.1111 12.2898 6.18803C8.23984 6.03418 4.63984 4.03418 2.08984 0.957257C0.739844 3.26495 1.48984 6.18803 3.58984 7.72649C2.83984 7.72649 2.08984 7.4188 1.33984 7.1111C1.33984 9.4188 2.98984 11.5726 5.23984 12.188C4.48984 12.3419 3.73984 12.4957 2.98984 12.3419C3.58984 14.3419 5.38984 15.8803 7.63984 15.8803C5.83984 17.2649 3.13984 18.0342 0.589844 17.7265C2.83984 19.1111 5.38984 20.0342 8.08984 20.0342C17.2398 20.0342 22.3398 12.188 22.0398 4.95726C23.0898 4.34187 23.9898 3.4188 24.5898 2.34187Z"
					fill="url(#paint0_linear_119_8829)"
				/>
				<defs>
					<linearGradient
						id="paint0_linear_119_8829"
						x1="12.5898"
						y1="0.0341797"
						x2="12.0564"
						y2="23.9144"
						gradientUnits="userSpaceOnUse"
					>
						<stop stop-color="white" />
						<stop offset="1" stop-color="#D7D7D7" />
					</linearGradient>
				</defs>
			</svg>
		</div>
	);
}

function DappDetailSection(props) {
	return (
		<section className="my-6">
			{props.title && (
				<h1 className="text-[24px] leading-[32px] font-[500] mb-4">
					{props.title}
				</h1>
			)}
			{props.children}
		</section>
	);
}
//this button redirects to analytics url which redirects to download url if wallet is connected otherwise it calls getBuildUrl and then redirects to build url.
function DownloadButton(props) {
	const { href, dApp } = props;
	const { data, isLoading, isFetching } = useGetBuildDownloadUrlQuery(
		dApp.dappId
	);
	if (isLoading || isFetching) return null;
	console.log(dApp.dappId);
	console.log(href);
	console.log(data, isLoading, isFetching);
	const downloadAvailable =
		dApp.availableOnPlatform.includes("android") ||
		dApp.availableOnPlatform.includes("ios");
	const classnames = classNames({
		"text-[#ddd]": !downloadAvailable,
		"text-[#fff]": downloadAvailable,
		"p-4 font-[600] text-[14px]": true,
	});
	const currentColor =
		downloadAvailable && (href != undefined || data != undefined)
			? "#fff"
			: "#525059";
	return (
		<a
			className={classnames}
			href={
				downloadAvailable
					? href != undefined
						? href
						: data != undefined
						? data?.url
						: null
					: null
			}
		>
			<svg
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M12 15V3M12 15L7 10M12 15L17 10M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
					stroke={currentColor}
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		</a>
	);
}

//Claiming a dapp on meroku .
function ClaimDappSection(props) {
	const { onClick, address, onOpenConnectModal, minted } = props;
	return (
		<Row className="items-start justify-between">
			<div className="w-8/12 flex flex-col gap-[16px]">
				<h2 className="text-[24px] text-[500] leading-[32px]">
					Claim this dApp
				</h2>
				<p className="text-[#87868C]">
					This dApp has not been claimed by its developers. Click here
					to open the Meroku platform and claim your .app domain
				</p>
				{/* {!address && onOpenConnectModal && <p onClick={onOpenConnectModal} className="text-[14px] leading-[24px] underline cursor-pointer">Do you own this dApp? Connect wallet to update</p>} */}
			</div>
			<ClaimButton onClick={onClick}>Claim</ClaimButton>
		</Row>
	);
}
// if the user is owner of the dapp, it shows update dapp button.
function UpdateDappSection(props) {
	const { onClick } = props;
	return (
		<Row className="items-start justify-between">
			<div className="w-8/12 flex flex-col gap-[16px]">
				<h2 className="text-[24px] text-[500] leading-[32px]">
					Update dApp
				</h2>
				<p className="text-[#87868C]">
					Click here to update the dApp metadata on the Meroku
					platform. You are seeing this because you have claimed this
					dApp's .app namespace
				</p>
			</div>
			<ClaimButton onClick={onClick}>Update</ClaimButton>
		</Row>
	);
}

function Input(props) {
	return (
		<textarea
			rows={5}
			className="bg-transparent border-[#2D2C33] border-[1px] rounded-[12px] p-[20px]"
			{...props}
		/>
	);
}

export function StarRating(props) {
	const { editable, onChange } = props;
	const [rating, setRating] = useState(props.rating);
	const [hover, setHover] = useState(0);
	useEffect(() => {
		if (typeof onChange === "function") {
			onChange(rating);
		}
	}, [rating]);
	return (
		<Row
			className="gap-x-[4px]"
			onMouseLeave={editable ? () => setRating(rating) : undefined}
		>
			{[...Array(5)].map((_, idx) => {
				idx += 1;
				return (
					<svg
						onClick={editable ? () => setRating(idx) : undefined}
						onMouseEnter={
							editable ? () => setHover(idx) : undefined
						}
						onMouseLeave={
							editable ? () => setRating(rating) : undefined
						}
						className={`icon ${
							idx <= (rating || hover) ? "icon-filled" : null
						}`}
						width="24"
						height="25"
						viewBox="0 0 24 25"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M12 2.5L15.09 8.76L22 9.77L17 14.64L18.18 21.52L12 18.27L5.82 21.52L7 14.64L2 9.77L8.91 8.76L12 2.5Z"
							stroke="currentcolor"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				);
			})}
		</Row>
	);
}
// review is only possible when user has either opened or downloaded dapp via store after connecting wallet.
function ReviewDialog(props) {
	const [postReview, result, isLoading, isFetching] = usePostReviewMutation();
	const [errors, setErrors] = useState();
	const { address } = useAccount();
	const [review, setReview] = useState<Review>({
		dappId: props.dappId,
		userAddress: address,
	} as Review);
	const onSubmit = (evt) => {
		console.log(result.isUpdating);

		postReview({ ...review, rating: review.rating ?? 0 })
			.unwrap()
			.then((_) => {
				props.onRequestClose();
			})
			.catch((err) => {
				console.log(err);
				setErrors(err);
			});
		console.log(result.isUpdating);
	};

	if (errors) {
		return (
			<Column height="25" className={"gap-y-[40px] relative"}>
				<h1 className="text-[20px] leading-[24px] font-[500]">
					Failed to add review
				</h1>
				<button
					onClick={() => props.onRequestClose()}
					className="absolute right-0 "
				>
					<svg
						width="24"
						height="25"
						viewBox="0 0 24 25"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M6 6.5L18 18.5M18 6.5L6 18.5"
							stroke="#E2E1E6"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</button>
				<Column>
					Have you opened or downloaded dapp before posting review?
				</Column>
			</Column>
		);
	}
	return (
		<>
			<Column className={"gap-y-[32px] relative"}>
				<h1 className="text-[20px] leading-[24px] font-[500]">
					Add Review
				</h1>
				<button
					onClick={() => props.onRequestClose()}
					className="absolute right-0 "
				>
					<svg
						width="24"
						height="25"
						viewBox="0 0 24 25"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M6 6.5L18 18.5M18 6.5L6 18.5"
							stroke="#E2E1E6"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</button>
				<Column className="items-start justify-start gap-y-[8px] input">
					<label htmlFor="">Add Rating</label>
					<StarRating
						editable={true}
						onChange={(val) =>
							setReview({ ...review, rating: val })
						}
					/>
				</Column>
				<Column className="gap-y-[8px]">
					<label htmlFor="">Write a review</label>
					<Input
						onChange={(evt) =>
							setReview({ ...review, comment: evt.target.value })
						}
					/>
				</Column>

				<Button
					disabled={
						!(
							review.rating != undefined ||
							review.comment != undefined
						) ||
						isLoading ||
						isFetching
					}
					onClick={onSubmit}
				>
					Submit
				</Button>
			</Column>
		</>
	);
}

function AppRatingList(props) {
	const { data, isLoading, isFetching } = useGetAppRatingQuery(props.id);
	const { openConnectModal } = useConnectModal();
	const dApp = props.dapp;

	const { address } = useAccount();
	if (isLoading || isFetching) return null;
	return (
		<>
			<Row className="justify-between items-center py-[24px]">
				<h1 className="text-[24px] leading-[32px] font-[500]">
					{AppStrings.reviewsTitle}
				</h1>
				<button
					className="flex items-center gap-x-[8px] text-transparent bg-clip-text bg-gradient-to-b from-[#8A46FF] to-[#6E38CC] font-bold text-[14px] leading-[18px]"
					onClick={() => {
						if (address) {
							props.onCreateReivew();
							return;
						} else if (openConnectModal) {
							openConnectModal();
						}
					}}
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

			<Row className="gap-x-[18px] ">
				<p className="text-[24px] leading-[28px] font-[600]">
					{Math.round((dApp?.metrics?.rating ?? 0) * 10) / 10}
				</p>
				<StarRating
					rating={Math.round((dApp?.metrics?.rating ?? 0) * 10) / 10}
				/>
			</Row>
			<small className="text-[14px] leading-[34px] font-[500] text-[#87868C]">
				{dApp?.metrics?.ratingsCount ?? 0} Ratings
			</small>
			<Row className="gap-x-[16px] items-stretch ">
				{data.data.slice(0, 2).map((review) => (
					<ReviewCard review={review} />
				))}
			</Row>
			{!!data.data.length && (
				<Row className="justify-end my-[16px]">
					<Link
						className="text-transparent bg-clip-text bg-gradient-to-b from-[#8A46FF] to-[#6E38CC] font-bold text-[14px] leading-[18px]"
						href={`dapp/reviews/?id=${props.id}`}
					>
						View More
					</Link>
				</Row>
			)}
			<Divider />
		</>
	);
}

function DappList(props) {
	const router = useRouter();
	const [isClaimOpen, setClaimOpen] = useState<boolean>(false);
	const { openConnectModal } = useConnectModal();
	const app = useSelector(getApp);
	const { query } = useRouter();
	const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
	useEffect(() => {
		if (isClaimOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}
	}, [isClaimOpen, isReviewModalOpen]);

	const { data, isFetching, isLoading } = useSearchByIdQuery(
		query.id,
		{
			page: 1,
			limit: 1,
			chainId: app.chainId,
		},
		{
			refetchOnMountOrArgChange: false,
		}
	);

	const { address } = useAccount();

	const { ownedApps, isOwnedAppsLoading } = useGetDappByOwnerAddressQuery(
		address,
		{
			skip:
				address === undefined &&
				(isLoading || isFetching || !data[0]?.minted),
		}
	);

	if (isLoading || isFetching)
		return (
			<PageLayout>
				<div className="shimmer w-full h-[400px] mb-[16px] rounded-lg" />
				<div className="shimmer w-full h-[100px] mb-[16px] rounded-lg" />
				<div className="shimmer w-full h-[100px] mb-[16px] rounded-lg" />
				<div className="shimmer w-full h-[100px] mb-[16px] rounded-lg" />
			</PageLayout>
		);

	if (!data) return <PageLayout>Missing post!</PageLayout>;

	const dApp: Dapp = data.data[0];

	if (isLoading || isFetching)
		return (
			<PageLayout>
				<div className="shimmer w-full h-[400px] mb-[16px] rounded-lg" />
				<div className="shimmer w-full h-[100px] mb-[16px] rounded-lg" />
				<div className="shimmer w-full h-[100px] mb-[16px] rounded-lg" />
				<div className="shimmer w-full h-[100px] mb-[16px] rounded-lg" />
			</PageLayout>
		);

	if (!dApp) {
		return <PageLayout>Missing post!</PageLayout>;
	}

	const history = JSON.parse(localStorage.getItem("dApps") ?? "{}");
	localStorage.setItem(
		"dApps",
		JSON.stringify(Object.assign({}, history, { [dApp.dappId]: dApp }))
	);
	const args = new URLSearchParams();
	let viewLink;
	let downloadLink;
	if (address) {
		args.set("userAddress", address);
		viewLink = `${BASE_URL}/o/view/${dApp.dappId}?${args.toString()}`;
		downloadLink = `${BASE_URL}/o/download/${
			dApp.dappId
		}?${args.toString()}`;
	} else {
		viewLink = dApp.appUrl;
	}

	const isOwner = isOwnedAppsLoading
		? false
		: ownedApps?.data?.includes(dApp.dappId) || false;
	const customCategory: string = merokuToCustomCategory(
		dApp?.category,
		dApp?.subCategory
	).category as string;

	const getIframeSrc = (): string => {
		return isOwner
			? "https://app.meroku.org/update"
			: "https://app.meroku.org/app";
	};

	const onClaimButtonClick = () => {
		if (!!address) {
			setClaimOpen(true);
			return;
		} else if (openConnectModal) {
			openConnectModal();
		}
	};

	return (
		<PageLayout>
			<div className="flex flex-col">
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
					<span className="text-2xl">{AppStrings.allDapps}</span>
				</div>
				{dApp.images.banner && (
					<div className="z-0 relative top-[16px] lg:top-[48px] w-full h-[200px] lg:h-[400px]">
						<Image
							src={dApp.images.banner}
							placeholder={
								"/assets/images/banner_placeholder.png"
							}
							fill={true}
							alt="DApp Banner"
							className="aspect-video	rounded-lg object-cover	"
						/>
					</div>
				)}
				<section>
					<header className="z-10 flex flex-col md:flex-row md:justify-between md:items-end gap-4 px-[8px] lg:px-[16px]">
						<div className="flex-auto flex flex-row items-end  gap-[16px] pl-[8px] md:pl-0">
							<div className="relative bg-canvas-color flex-initial rounded-2xl w-[74px relative] w-[64px] h-[64px] lg:w-[132px] lg:h-[132px]">
								<Image
									sizes="(max-width: 768px) 100vw,
                                          (max-width: 1200px) 50vw,
                                          33vw"
									style={{ aspectRatio: 1 }}
									fill={true}
									src={dApp.images.logo}
									className="rounded-lg w-[64px] lg:w-[64px] "
									alt=""
								/>
							</div>
							<div className="flex-auto  pt-4">
								<p className="text-[12px] leading-[16px] md:text-[16px] md:leading-[20px] uppercase my-2">
									{customCategory}
								</p>
								<p className="text-[16px] leading-[20px] md:text-[32px] md:leading-[38px] font-[600] line-clamp-1">
									{dApp.name}
								</p>
							</div>
						</div>
						<div className="flex-initial flex">
							<Button
								as="a"
								className="flex flex-grow justify-center"
								target="_blank"
								href={viewLink}
							>
								<div className="text-[12px] mx-2 lg:text-[14px] font-[500]">
									{AppStrings.visitDapp}
								</div>
								<svg
									className="mx-2 w-[16px] hover:text-black"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M7 17L17 7M17 7V17M17 7H7"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</Button>

							<a
								target="_blank"
								href={`https://twitter.com/intent/tweet?text=Hey%2C%20I%20found%20this%20amazing%20dapp%2C%20check%20it%20out%20${HOST_URL}${router.asPath}`}
								className="p-4 font-[600] text-[14px]"
							>
								<svg
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M8.59003 13.51L15.42 17.49M15.41 6.51001L8.59003 10.49M21 5C21 6.65685 19.6569 8 18 8C16.3431 8 15 6.65685 15 5C15 3.34315 16.3431 2 18 2C19.6569 2 21 3.34315 21 5ZM9 12C9 13.6569 7.65685 15 6 15C4.34315 15 3 13.6569 3 12C3 10.3431 4.34315 9 6 9C7.65685 9 9 10.3431 9 12ZM21 19C21 20.6569 19.6569 22 18 22C16.3431 22 15 20.6569 15 19C15 17.3431 16.3431 16 18 16C19.6569 16 21 17.3431 21 19Z"
										stroke="#E2E1E6"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
							</a>

							<DownloadButton href={downloadLink} dApp={dApp} />
						</div>
					</header>
					<DappDetailSection title={AppStrings.about}>
						<ExpandAbleText maxCharacters={320} maxLines={3}>
							{dApp.description}
						</ExpandAbleText>
					</DappDetailSection>
					<Divider />
					<AppRatingList
						id={dApp.dappId}
						dapp={dApp}
						onCreateReivew={() => setIsReviewModalOpen(true)}
					/>
					{dApp.images.screenshots?.length && (
						<>
							<DappDetailSection title={AppStrings.gallery}>
								<div className="grid grid-cols-3 gap-4">
									{dApp.images.screenshots?.map((e, idx) => (
										<img
											key={idx}
											src={e || ""}
											alt="DApp Screenshot"
										/>
									))}
								</div>
							</DappDetailSection>
							<Divider />
						</>
					)}
					<DappDetailSection>
						{/* {!!address && isOwner ?
                            <UpdateDappSection onClick={onClaimButtonClick} /> :
                            <ClaimDappSection address={address} onClick={onClaimButtonClick} onOpenConnectModal={openConnectModal} minted={dApp.minted} />} */}

						{!(address == undefined) ? (
							isOwner ? (
								<UpdateDappSection
									onClick={onClaimButtonClick}
								/>
							) : !(dApp.minted == undefined || !dApp.minted) ? (
								openConnectModal && (
									<p
										onClick={openConnectModal}
										className="text-[14px] leading-[24px] underline cursor-pointer"
									>
										Do you own this dApp? Connect wallet to
										update
									</p>
								)
							) : (
								<ClaimDappSection
									address={address}
									onClick={onClaimButtonClick}
									onOpenConnectModal={openConnectModal}
								/>
							)
						) : (
							<ClaimDappSection
								address={address}
								onClick={onClaimButtonClick}
								onOpenConnectModal={openConnectModal}
							/>
						)}
					</DappDetailSection>
				</section>
			</div>
			{isReviewModalOpen && (
				<Modal
					isOpen={isReviewModalOpen}
					style={reviewModalStyle}
					onRequestClose={() => setIsReviewModalOpen(false)}
				>
					<ReviewDialog
						dappId={dApp.dappId}
						onRequestClose={() => setIsReviewModalOpen(false)}
					/>
				</Modal>
			)}
			{isClaimOpen && (
				<Modal
					isOpen={isClaimOpen}
					onRequestClose={() => setClaimOpen(false)}
					style={modalStyles}
				>
					<div className="w-full m-auto">
						<div className="flex justify-end ">
							<button onClick={() => setClaimOpen(false)}>
								<svg
									width="40"
									height="40"
									viewBox="0 0 40 40"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M27.5291 9L19.8848 16.6459L12.2404 9L10 11.2404L17.6459 18.8848L10 26.5291L12.2404 28.7695L19.8848 21.1236L27.5291 28.7695L29.7695 26.5291L22.1236 18.8848L29.7695 11.2404L27.5291 9Z"
										fill="white"
									/>
								</svg>
							</button>
						</div>
						<div className="bg-canvas-color">
							<iframe
								className="w-full rounded-[16px] min-h-screen"
								src={getIframeSrc()}
							/>
						</div>
					</div>
				</Modal>
			)}
		</PageLayout>
	);
}

export default DappList;
