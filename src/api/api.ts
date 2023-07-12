import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "./constants";

// React Toolkit Setup
export const api = createApi({
	baseQuery: fetchBaseQuery({
		baseUrl: BASE_URL,
	}),
	endpoints: () => ({}),
});
