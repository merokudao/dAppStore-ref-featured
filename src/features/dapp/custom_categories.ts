/*
Meroku dapp store sends a big list of categories, out of which dapp stores might want to show limited categories
or a few categories clustered up, this file contains a list of Categories and subcategories that needs to be shown in dappstore
*/
export const categories = {
	message: "success",
	data: [
		{
			category: "B2B",
			subCategory: [],
		},
		{
			category: "Utility",
			subCategory: [],
		},
		{
			category: "Tooling",
			subCategory: [
				"Security",
				"Monitoring",
				"Storage",
				"Front Ends",
				"Messaging",
				"Block Explorers",
				"Indexer",
				"Wallet",
			],
		},
		{
			category: "Social",
			subCategory: [],
		},
		{
			category: "Infrastructure",
			subCategory: [
				"Oracles",
				"Node Infra",
				"Bridges",
				"Identity",
				"Payments",
				"Analytics",
				"On-Ramp/Off-Ramp",
			],
		},
		{
			category: "Metaverse",
			subCategory: [],
		},
		{
			category: "Gaming",
			subCategory: [
				"Puzzle and strategy games",
				"Action and adventure games",
				"First-person action games",
				"Role-playing games (RPG)",
				"Sports and racing games",
				"Simulation games",
				"Studios",
			],
		},
		{
			category: "NFT",
			subCategory: [
				"Marketplace",
				"Music",
				"Domain Names",
				"PFPs",
				"Social Graph",
				"Art",
				"NFT Tooling / Infra",
			],
		},
		{
			category: "DAO",
			subCategory: ["Investing", "Tooling", "DAO - Misc"],
		},
		{
			category: "DeFi",
			subCategory: [
				"Stablecoins",
				"Decentralized Exchanges",
				"Lending and Borrowing",
				"Liquid Staking",
				"Yield Aggregation / Farming",
				"Derivatives, Perps, Trading",
				"Real World Assets / Tokenization",
				"Insurance",
				"Prediction Markets",
				"DeFi - Other",
			],
		},
		{
			category: "Education",
			subCategory: [],
		},
		{
			category: "Others",
			subCategory: [],
		},
	],
};
