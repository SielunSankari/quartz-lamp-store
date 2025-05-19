import { create } from 'zustand';

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

type CartState = {
  cart: CartItem[];
  totalItems: number;
  totalPrice: number;
  setCart: (cart: CartItem[]) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>(set => ({
  cart: [],
  totalItems: 0,
  totalPrice: 0,

  setCart: cart => set(() => ({
    cart,
    totalItems: cart.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
  })),

  removeItem: itemId => set((state) => {
    const newCart = state.cart.filter(item => item.id !== itemId);
    return {
      cart: newCart,
      totalItems: newCart.reduce((sum, item) => sum + item.quantity, 0),
      totalPrice: newCart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    };
  }),

  clearCart: () => set(() => ({
    cart: [],
    totalItems: 0,
    totalPrice: 0,
  })),
}));
