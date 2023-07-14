import { Action, ThunkAction, configureStore } from "@reduxjs/toolkit";
import { api } from "../api/api";
import "../features/app/app_slice";
import { appSlice } from "../features/app/app_slice";

export const store = configureStore({
	reducer: {
		app: appSlice.reducer,
		[api.reducerPath]: api.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(api.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	RootState,
	unknown,
	Action<string>
>;
