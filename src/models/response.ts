export interface PagedResponse<T> {
	page: string;
	limit: number;
	pageCount: number;
	data: T[];
}

export interface PagedRequest {
	page: number;
	limit: number;
}

export interface CategoryListResponse {
	data: {
		category: string;
		subCategory: string;
	}[];
	message: string;
}

export interface IWebstoreQueryParams {
	allowedInCountries: Array<string>;
	availableOnPlatform: Array<string>;
	blockedInCountries: Array<string>;
	categories: Array<string>;
	chainId: Array<string>;
	isListed: Array<string>;
	language: Array<string>;
	limit: Array<string>;
	listedOnOrAfter: Array<string>;
	listedOnOrBefore: Array<string>;
	matureForAudience: Array<string>;
	minAge: Array<string>;
	orderBy: Array<string>;
	page: Array<string>;
	search: Array<string>;
	subCategory: Array<string>;
}

export interface BuildDownloadResponse {
	success: boolean;
	url: string;
}
