import { PageLayout } from "@/components";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AppList } from "../../components/app_list";
import { getApp } from "../../features/app/app_slice";
import { customToMerokuCategory } from "../../features/categories";
import {
	useGetCategoryListQuery,
	useGetInfiniteDappListQuery,
} from "../../features/dapp/dapp_api";
import Dapp from "../dapp";

function CategoriesList(props) {
	const router = useRouter();
	// const limit = 8;
	// const {
	//     data,
	//     isFetching,
	//     isLoading,
	// } = useGetDappListQuery({
	//     ...router.query
	// }, {
	//     page:1,
	//     limit:8,
	// },{
	//     refetchOnMountOrArgChange:true
	// });
	const limit = 8;
	const app = useSelector(getApp);
	const [page, setPage] = useState<number>(1);
	const [items, setItems] = useState<Array<typeof Dapp>>([]);
	const merokuData = useGetCategoryListQuery({});

	let categoryMapped = customToMerokuCategory(
		router.query.categories,
		merokuData.data,
		router.query.subCategory
	);

	useEffect(() => {
		if (merokuData) {
			categoryMapped = customToMerokuCategory(
				router.query.categories,
				merokuData.data,
				router.query.subCategory
			);
		}
	}, [merokuData]);

	const { data, isFetching, isLoading } = useGetInfiniteDappListQuery(
		{
			search: router.query.search,
			categories: categoryMapped.category,
			subCategory: categoryMapped.subCategory,
			page,
			limit,
			chainId: app.chainId,
		},
		{
			refetchOnMountOrArgChange: false,
		}
	);

	// since now data is being merge in RTK itself
	useEffect(() => {
		if (data) {
			console.log("data", data);
			setItems([...data?.response]);
		}
	}, [data]);

	// const observerTarget = useRef(null);

	// const opt = {
	//     threshold: 1,
	// };

	// this one doesn't need to be refrished to listen to scroll events
	useEffect(() => {
		const onScroll = () => {
			const scrolledToBottom =
				window.innerHeight + window.scrollY + window.innerHeight / 3 >=
				document.body.offsetHeight;
			if (
				scrolledToBottom &&
				!isFetching &&
				page < (data?.pageCount || 0)
			) {
				console.log("Fetching more search data...");
				setPage(page + 1);
			}
		};

		document.addEventListener("scroll", onScroll);

		return function () {
			document.removeEventListener("scroll", onScroll);
		};
	}, [page, isFetching, data?.pageCount]);

	const buildLoadingItems = (count: number = 10) => {
		const _items: any[] = [];
		for (let i = 0; i < count; i++) {
			_items.push(
				<div key={i} className="shimmer w-full h-[160px] rounded-lg" />
			);
		}
		return _items;
	};

	let child;
	if (router.query.categories === "Others" || router.query.search) {
		if (isLoading || (isFetching && items.length === 0))
			return (
				<PageLayout>
					<div>
						<div className="bg-border-color w-[240px] h-[32px] my-4" />
						<div className="grid gap-8 grid-cols-1 md:grid-cols-2 3xl:grid-cols-3">
							{buildLoadingItems()}
						</div>
					</div>
				</PageLayout>
			);
	} else {
		if (
			isLoading ||
			(isFetching &&
				(items.length === 0 ||
					(items[0] as any)?.category !== categoryMapped.category ||
					(items[0] as any)?.subCategory !==
						categoryMapped.subCategory))
		) {
			return (
				<PageLayout>
					<div>
						<div className="bg-border-color w-[240px] h-[32px] my-4" />
						<div className="grid gap-8 grid-cols-1 md:grid-cols-2 3xl:grid-cols-3">
							{buildLoadingItems()}
						</div>
					</div>
				</PageLayout>
			);
		}
	}

	child = <AppList data={items}></AppList>;
	return (
		<PageLayout>
			<h1 className="text-[24px] leading-[32px] lg:text-4xl mb-8 capitalize">
				{props.title || router.query.categories}
			</h1>

			{router.query.subCategory && (
				<h2 className="text-[20px] leading-[28px]  mb-8 capitalize">
					{router.query.subCategory}
				</h2>
			)}
			{child}

			{isLoading || isFetching ? (
				<div>
					<div className="h-[35px] w-full" />
					<div className="grid gap-8 grid-cols-1 md:grid-cols-2 3xl:grid-cols-3">
						{buildLoadingItems(4)}
					</div>
				</div>
			) : null}
		</PageLayout>
	);
}

export default CategoriesList;
