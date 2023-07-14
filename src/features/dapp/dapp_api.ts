import { EndpointBuilder } from "@reduxjs/toolkit/dist/query/endpointDefinitions";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { api } from "../../api/api";
import { ApiEndpoints } from "../../api/constants";
import {
	BuildDownloadResponse,
	CategoryListResponse,
	PagedRequest,
	PagedResponse,
} from "../../models/response";
import { categories } from "./custom_categories";
import { Dapp } from "./models/dapp";
import { Review } from "./models/review";
// this is a collection of endpoint call with RTK to get all the dapp related data.
interface IDappDataSource {
	getFeaturedList(builder: EndpointBuilder<any, any, any>);

	getAppList(builder: EndpointBuilder<any, any, any>);

	getInfiniteAppList(builder: EndpointBuilder<any, any, any>);

	getDappReviews(builder: EndpointBuilder<any, any, any>);

	getCategoryList(builder: EndpointBuilder<any, any, any>);

	getAppsInCategoryList(builder: EndpointBuilder<any, any, any>);

	getDappByOwnerAddress(builder: EndpointBuilder<any, any, any>);
	getFeaturedDapps(builder: EndpointBuilder<any, any, any>);
	getAppRating(builder: EndpointBuilder<any, any, any>);
	getBuildDownloadUrl(builder: EndpointBuilder<any, any, any>);
}

export class DappDataSource implements IDappDataSource {
	registerEndpoints(this, api) {
		return api.injectEndpoints({
			endpoints: (build) => ({
				getDappList: this.getAppList(build),
				getInfiniteDappList: this.getInfiniteAppList(build),
				getFeaturedList: this.getFeaturedList(build),
				getCategoryList: this.getCategoryList(build),
				getAppsInCategoryList: this.getAppsInCategoryList(build),
				getDappByOwnerAddress: this.getDappByOwnerAddress(build),
				getFeaturedDapps: this.getFeaturedDapps(build),
				getAppRating: this.getAppRating(build),
				postReview: this.postReview(build),
				getBuildDownloadUrl: this.getBuildDownloadUrl(build),
			}),
		});
	}

	getAppList(builder: EndpointBuilder<any, any, any>) {
		return builder.query<PagedResponse<Dapp>, PagedRequest>({
			query: (args) => ({
				url: `${ApiEndpoints.APP_LIST}`,
				params: args,
			}),
		});
	}

	// New RTK added for infinite list, this one merger the data itself
	getInfiniteAppList(builder: EndpointBuilder<any, any, any>) {
		return builder.query<any, any>({
			query: (args) => ({
				url: `${ApiEndpoints.APP_LIST}`,
				params: args,
			}),
			serializeQueryArgs: ({
				queryArgs,
				endpointDefinition,
				endpointName,
			}) => {
				let key = endpointName + queryArgs.chainId;
				if (queryArgs?.categories) {
					key += queryArgs?.categories;
				}
				if (queryArgs?.subCategory) {
					key += queryArgs?.subCategory;
				}
				if (queryArgs?.search) {
					key += queryArgs?.search;
				}
				return key;
			},
			forceRefetch({ currentArg, previousArg }) {
				console.log("PreviousPage: ", previousArg?.page);
				console.log("CurrentPage: ", currentArg?.page);
				return currentArg?.page === previousArg?.page
					? currentArg?.chainId !== previousArg?.chainId
					: true;
			},
			keepUnusedDataFor: 360,
			// Always merge incoming data to the cache entry
			merge: (currentCache, newItems, otherArgs) => {
				console.log("newItems", newItems);
				if (newItems.page < currentCache.page) {
					currentCache.response = newItems.response;
					currentCache.page = newItems.page;
					return;
				}
				if (currentCache.page === newItems.page) return;
				if (currentCache.response === undefined) {
					currentCache.response = newItems.response;
				} else {
					currentCache.response?.push(...newItems.response);
				}
				currentCache.page = newItems.page;
				console.log("currentCache", currentCache);
			},
		});
	}

	getFeaturedList(builder: EndpointBuilder<any, any, any>) {
		return builder.query<PagedResponse<Dapp>, void>({
			query: () => ApiEndpoints.FEATURED,
		});
	}

	getDappReviews(builder: EndpointBuilder<any, any, any>) {
		return builder.query<PagedResponse<Review>, string>({
			query: (appId) => `${ApiEndpoints.REVIEWS}?dappId=${appId}`,
		});
	}

	getCategoryList(builder: EndpointBuilder<any, any, any>) {
		return builder.query<CategoryListResponse, any>({
			query: () => ApiEndpoints.APP_CATEGORIES_LIST,
			keepUnusedDataFor: 3600,
		});
	}

	getAppsInCategoryList(builder: EndpointBuilder<any, any, any>) {
		return builder.query<PagedResponse<Dapp>, Array<string>>({
			query: (params) => ({
				url: `/api/v1/dapp/search`,
				params: params,
			}),
		});
	}

	getDappByOwnerAddress(builder: EndpointBuilder<any, any, any>) {
		return builder.query<any, string>({
			query: (ownerAddress) => ({
				url: `api/v1/dapp/search/address/${ownerAddress}`,
			}),
		});
	}

	getPolygonCategoryList() {
		return categories;
	}

	getFeaturedDapps(builder: EndpointBuilder<any, any, any>) {
		return builder.query<Dapp, void>({
			async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
				const appIdsReq = await fetchWithBQ(ApiEndpoints.FEATURED);
				if (appIdsReq.error)
					return { error: appIdsReq.error as FetchBaseQueryError };
				const appIds = appIdsReq.data[0].dappIds;
				const result = <any>[];
				for (const idx in appIds) {
					const appReq = await fetchWithBQ(
						`/api/v1/dapp/search/${appIds[idx]}`
					);
					result.push(appReq.data.data[0]);
				}
				return result.length
					? { data: result }
					: { error: result.error as FetchBaseQueryError };
			},
		});
	}

	getAppRating(builder: EndpointBuilder<any, any, any>) {
		return builder.query<any, string>({
			query: (id) => ({
				url: `${ApiEndpoints.RATING}/${id}`,
			}),
		});
	}
	postReview(builder: EndpointBuilder<any, any, any>) {
		return builder.mutation<void, any>({
			query: ({ ...body }) => {
				return {
					url: `${ApiEndpoints.RATING}`,
					method: "POST",
					body: body,
				};
			},
		});
	}
	getBuildDownloadUrl(builder: EndpointBuilder<any, any, any>) {
		return builder.query<BuildDownloadResponse, string>({
			query: (id) => ({
				url: `${ApiEndpoints.BUILD_DOWNLOAD_URL}/${id}/build`,
			}),
		});
	}
}

export const dAppDataSource = new DappDataSource();

export const {
	useGetDappListQuery,
	useGetInfiniteDappListQuery,
	useGetCategoryListQuery,
	useGetDappByOwnerAddressQuery,
	useGetFeaturedDappsQuery,
	useGetAppRatingQuery,
	usePostReviewMutation,
	useGetBuildDownloadUrlQuery,
} = dAppDataSource.registerEndpoints(api);

export const getPolygonCategoryList = dAppDataSource.getPolygonCategoryList;
