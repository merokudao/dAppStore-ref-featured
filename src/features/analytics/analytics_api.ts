import { EndpointBuilder } from "@reduxjs/toolkit/dist/query/endpointDefinitions";
import { ApiEndpoints } from "../../api/constants";
import { Analytics } from "./models/analytics";
//this is not being used
interface IAnalyticsDataSource {
	postAnalytics(build: EndpointBuilder<any, any, any>);
}

export class AnalyticsDataSource implements IAnalyticsDataSource {
	registerEndpoints(api) {
		api.injectEndpoints({
			endpoints: (build) => ({
				postAnalytics: this.postAnalytics(build),
			}),
		});
	}

	postAnalytics(build: EndpointBuilder<any, any, any>) {
		return build.mutation<Analytics, void>({
			query: () => ({
				url: ApiEndpoints.ANALYTICS,
				method: "POST",
				body: {
					analytics: {
						dappId: "com.axieinfinity.dapp",
						userAddress:
							"0x2bD7Fe74aA4E442b9EA407fBBEEe331840018465",
						metadata: {
							test: "dapp.testing.com",
						},
					},
				},
			}),
		});
	}
}

const analyticsDataSource = new AnalyticsDataSource();
export { analyticsDataSource };
