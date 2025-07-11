import { configureStore } from "@reduxjs/toolkit";
import callSlice from "./reducers/callSlice"; // Adjust the import path as necessary

export const store= configureStore({

    reducer: {
        // Add your reducers here
        callSlice: callSlice,
    },
    
});

export type RootState = ReturnType<typeof store.getState>;