// features/cart/cartSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ServiceParameter {
  id: string;
  label: string;
  type: "number" | "text" | "select";
  required?: boolean;
  options?: string[];
  value?: any;
}

export interface ServicePayload {
  service_id: string;
  service_name: string;
  description?: string;
  material_name?: string;
  m_cost?: number;
  no_unit?: number;
  unit?: string;
  parameters?: ServiceParameter[];
}

export interface CartItem {
  id: string;
  productOrigin: string;
  selectedProduct: string | null;
  productPrice: number | null;
  productName: string;
  selectedVariation: any | null;
  service: string;
  servicePayload: ServicePayload | null;
  selectedColor: string | null;
  selectedSize: number | null;
  colorName: string | null;
  sizes: Record<string, { quantity: number; name: string }>;
  totalQuantity: number;
  additionalNotes: string;
  colorNotes: string;
  sizeNotes: string;
  frontDesign?: string | null;
  backDesign?: string | null;
  leftSleeveDesign?: string | null;
  rightSleeveDesign?: string | null;
}

interface CartState {
  items: CartItem[];
}

// Load initial state from localStorage
const getInitialState = (): CartState => {
  if (typeof window !== "undefined") {
    const savedCart = localStorage.getItem("cart");
    return {
      items: savedCart ? JSON.parse(savedCart) : [],
    };
  }
  return { items: [] };
};

export const cartSlice = createSlice({
  name: "cart",
  initialState: getInitialState(),
  reducers: {
    addToCart: (state, action: PayloadAction<Omit<CartItem, "id">>) => {
      const newItem = {
        ...action.payload,
        id: Date.now().toString(),
      };
      state.items.push(newItem);
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    updateCartItem: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<CartItem> }>,
    ) => {
      const index = state.items.findIndex(
        (item) => item.id === action.payload.id,
      );
      if (index !== -1) {
        state.items[index] = {
          ...state.items[index],
          ...action.payload.updates,
        };
        localStorage.setItem("cart", JSON.stringify(state.items));
      }
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.setItem("cart", "[]");
    },
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
      localStorage.setItem("cart", JSON.stringify(action.payload));
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateCartItem,
  clearCart,
  setCartItems,
} = cartSlice.actions;
export default cartSlice.reducer;
