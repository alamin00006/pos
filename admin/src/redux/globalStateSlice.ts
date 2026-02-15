import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GlobalState {
  customGlobalPrice: string;
  serviceGlobalPrice: boolean;
  cartEditModal: boolean;
}

const initialState: GlobalState = {
  customGlobalPrice: "no",
  serviceGlobalPrice: false,
  cartEditModal: false,
};

const globalStateSlice = createSlice({
  name: "globalState",
  initialState,
  reducers: {
    setCustomGlobalPrice(state, action: PayloadAction<string>) {
      state.customGlobalPrice = action.payload;
    },
    setServiceGlobalPrice(state, action: PayloadAction<boolean>) {
      state.serviceGlobalPrice = action.payload;
    },
    setCartEditModal(state, action: PayloadAction<boolean>) {
      state.cartEditModal = action.payload;
    },
  },
});

export const { setCustomGlobalPrice, setServiceGlobalPrice, setCartEditModal } =
  globalStateSlice.actions;

export default globalStateSlice.reducer;
