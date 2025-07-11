import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: [],
}

const callSlice = createSlice({   
    name: "call",
    initialState: initialState,
    reducers: {}

  })

// export const { actions, reducer } = callSlice;

export const {} = callSlice.actions;

export default callSlice.reducer;