/*
this file contains a mapping from meroku categories to dappstore categories and all the necessary conversions
*/
var dappstoreMaping = `{
	"Tooling": "developer tools",
	"Tooling.Security": "developer tools.security",
	"Tooling.Monitoring": "developer tools.monitoring",
	"Tooling.Storage": "developer tools.storage",
	"Tooling.Front Ends": "developer tools.front ends",
	"Tooling.Messaging": "social networking.messaging",
	"Tooling.Block Explorers": "developer tools.block explorers",
	"Tooling.Indexer": "developer tools.indexer",
	"Tooling.Wallet": "utilities.wallets",

    "Social": "social",

    "Infrastructure": "developer tools.developer infra",
	"Infrastructure.Oracles": "developer tools.oracles",
	"Infrastructure.Node Infra": "developer tools.node infra",
	"Infrastructure.Bridges": "developer tools.bridges",
	"Infrastructure.Identity": "developer tools.identity",
	"Infrastructure.Payments": "defi.payments",
	"Infrastructure.Analytics": "developer tools.analytics",

    "Metaverse": "games.metaverse",

    "Gaming": "games",
	"Gaming.Puzzle and strategy games": "games.puzzle",
	"Gaming.Action and adventure games": "games.adventure",
	"Gaming.First-person action games": "games.action",
	"Gaming.Role-playing games (RPG)": "games.role-playing",
	"Gaming.Sports and racing games": "games.racing",
	"Gaming.Simulation games": "games.simulation",
	"Gaming.Studios": "games.studios",

    "NFT": "nft",
	"NFT.Marketplace": "nft.marketplace",
	"NFT.Music": "entertainment.music",
	"NFT.Domain Names": "nft.domain names",
	"NFT.PFPs": "nft.peps",
	"NFT.Social Graph": "nft.social graph",
	"NFT.Art": "nft.art",
	"NFT.Tooling / Infra": "nft.tooling",

    "DAO": "productivity.decentralized-collaboration-tools",
	"DAO.Investing": "productivity.decentralized-collaboration-tools-investing",
	"DAO.Tooling": "productivity.decentralized-collaboration-tools-tools",
	"DAO.DAO - Misc": "productivity.decentralized-collaboration-tools-misc",

    "DeFi": "defi",
	"DeFi.Stablecoins": "defi.stablecoins",
	"DeFi.Decentralized Exchanges": "defi.exchanges",
	"DeFi.Lending and Borrowing": "defi.lending-and-borrowing",
	"DeFi.Liquid Staking": "defi.liquid staking",
	"DeFi.Yield Aggregation / Farming": "defi.farming",
	"DeFi.Real World Assets / Tokenization": "defi.tokenization",
	"DeFi.Insurance": "defi.insurance",
	"DeFi.Prediction Markets": "defi.product markets",
	"DeFi.DeFi - Other": "defi.others",

    "B2B": "business",

    "Utility": "utilities",

	"Infrastructure.On-Ramp/Off-Ramp": "defi.on-ramping, defi.off-ramping",

	"DeFi.Derivatives, Perps, Trading": "defi.trading",

  "Education" : "education"
}`;
// var merokuAPIData = JSON.parse(merokuJsonString).data;
var dappstoreMapingData = JSON.parse(dappstoreMaping);
// var merokuCategoryList: string[] = [];
var dappstoreMappedList: string[] = [];

// merokuAPIData.map((e) => merokuCategoryList.push(e.category));

(Object.values(dappstoreMapingData) as string[]).map((e) => {
	dappstoreMappedList.push(e.split(".")[0]);
});

// var othersList: string[] = merokuCategoryList.filter(
//   (value) => !polygonMappedList.includes(value.toLowerCase())
// );

interface CatSubCat {
	category: string | string[];
	subCategory?: string;
}

// Create a Map object to be passed
const customToMerokuMapping: Map<string, string> = new Map(
	Object.entries(JSON.parse(dappstoreMaping))
);

/**
 * mapping: A Map that contains mapping from custom's Category and Sub Category to Meroku's Category and Sub Category
 *
 */

const customToMerokuCategory = (
	category: string | string[] | undefined,
	merokuData: any,
	subCategory?: string | string[] | undefined
): CatSubCat => {
	let output: CatSubCat = { category: "" };
	var merokuCategoryList: string[] = [];

	if (merokuData !== undefined) {
		merokuData.data.map((e) => merokuCategoryList.push(e.category));
		var othersList: string[] = merokuCategoryList.filter(
			(value) => !dappstoreMappedList.includes(value.toLowerCase())
		);
		if (category === "Others") {
			output["category"] = othersList;
		}
	}

	const mapping = customToMerokuMapping;

	const key = subCategory
		? [category, subCategory].join(".")
		: (category as string);
	const value = mapping.get(key);
	if (value) {
		const [c, sc] = value.split(".");
		output["category"] = c;
		if (sc) {
			output["subCategory"] = sc;
		}
	}

	return output;
};

const merokuToCustomCategory = (
	category: string | string[] | undefined,
	subCategory?: string | string[] | undefined
): CatSubCat => {
	let output: CatSubCat = { category: "others" };
	const mapping = customToMerokuMapping;

	const value = subCategory
		? [category, subCategory].join(".")
		: (category as string);

	const keys = Object.keys(JSON.parse(dappstoreMaping));
	for (const key of keys) {
		if (mapping.get(key) === value) {
			if (key) {
				const [c, sc] = key.split(".");
				output["category"] = c;
				if (sc) {
					output["subCategory"] = sc;
				}
			}
		}
	}
	return output;
};

// const getOthersCategoryList = (
//   merokuCategoryAPIData: Array<{
//     category: string,
//     subCategory: Array<string>
//   }>
// ): Array<string> => {
//   var merokuCategoryList: string[] = [];
//   merokuCategoryAPIData.map((e) => merokuCategoryList.push(e.category));
//   var othersList: string[] = merokuCategoryList.filter(
//     (value) => !polygonMappedList.includes(value.toLowerCase())
//   );
//   return othersList;
// };

export { dappstoreMappedList, customToMerokuCategory, merokuToCustomCategory };
