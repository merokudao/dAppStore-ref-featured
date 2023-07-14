export const API_HOST = process.env.NEXT_PUBLIC_API_HOST;
export const API_PATH = process.env.NEXT_PUBLIC_API_PATH;
export const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION;
export const WC_PROJECT_ID = process.env.WC_PROJECT_ID;

export const BASE_URL = process.env.NEXT_PUBLIC_API_HOST;
export const HOST_URL = process.env.NEXT_PUBLIC_HOST_PATH;

// export const BASE_URL = `${API_HOST}/${API_PATH}/${API_VERSION}`;

export const ApiEndpoints = {
	ANALYTICS: "analytics",
	APP_LIST: "dapp",
	APP_CATEGORIES_LIST: "dapp/categories",
	CATEGORIES: "categories",
	CATEGORY_APPS: "categories/categorydapps",
	FEATURED: "store/featured",
	SEARCH_BY_ID: "dapp/search",
	SEARCH_BY_PKG_ID: "dapp/queryWithPackageId",
	REVIEWS: "reviews",
	RATING: "dapp/rate",
	FETCH_USER: "fetchuser",
	POST_USER: "postuser",
	SEARCH: "api/v1/dapp/search",
	BUILD_DOWNLOAD_URL: "dapp",
};
