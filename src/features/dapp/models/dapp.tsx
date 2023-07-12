export interface Dapp {
	name: string;
	description: string;
	developer: {
		website: string;
	};
	appUrl: string;
	dappId: string;
	minAge: number;
	isForMatureAudience: boolean;
	isSelfModerated: boolean;
	language: string;
	version: string;
	isListed: boolean;
	listDate: string;
	availableOnPlatform: Array<string>;
	category: string;
	subCategory: string;
	tags: Array<string>;
	chains: Array<number>;
	images: {
		banner: string;
		logo: string;
		screenshots: Array<string>;
	};
	metrics: {
		dappId: string;
		downloads: number;
		installs: number;
		uninstalls: number;
		ratingsCount: number;
		visits: number;
		rating: number;
	};
	users: [];
	minted?: boolean;
}
