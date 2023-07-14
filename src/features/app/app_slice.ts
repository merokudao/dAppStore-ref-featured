import { AppConfig, posConfig } from "../../app/constants";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AppState {
	config: AppConfig;
}

const initialState: AppConfig = posConfig;

export const appSlice = createSlice({
	name: "app",
	initialState,
	reducers: {
		setChainId: (state, action: PayloadAction<number | null>) => {
			state.chainId = action.payload;
		},
		setApp: (state, action) => {
			return action.payload;
		},
	},
});

export const { setApp, setChainId } = appSlice.actions;

export const getApp = (state: AppState) => (state as any).app;

export default appSlice.reducer;
