import axios from "axios";
import { setLoading, setCart, cartItemAdd, cartItemRemoval, setError } from "../slices/cart.js";

const userData = JSON.parse(sessionStorage.getItem("userInfo"));
console.log(userData);
export const fetchCart = () => async (dispatch) => {
  dispatch(setLoading(true));
  console.log(1);
  try {
    const response = await axios.get(`/api/carts/${userData._id}`, {
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    });

    const cart = response.data;
    dispatch(setCart(cart));
    console.log(2);
  } catch (error) {
    dispatch(
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
          ? error.message
          : "Something unexpected happened!!"
      )
    );
  }
};

export const addCartItem = (id, qty) => async (dispatch, getState) => {
  dispatch(setLoading(true));

  try {
    const cart = getState();
    const { cartId } = cart;
    console.log(cartId);
    const { data } = await axios.get(`/api/products/${id}`);
    const itemToAdd = {
      id: data._id,
      name: data.name,
      image: data.image,
      price: data.price,
      stock: data.stock,
      qty,
    };

    const response = await axios.put(
      `/api/carts/${cartId}`,
      { items: [itemToAdd] },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Cart update failed");
    }

    const updatedCart = response.data;
    console.log(updatedCart);

    dispatch(setCart(updatedCart));
    return itemToAdd;
  } catch (error) {
    dispatch(
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
          ? error.message
          : "Something unexpected happened!!"
      )
    );
  }
};

export const removeCartItem = (itemId) => async (dispatch) => {
  dispatch(setLoading(true));

  try {
    const response = await axios.delete(`/api/carts/${itemId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData.token}`,
      },
    });

    if (response.status !== 200) {
      throw new Error("Item removal failed");
    }

    const updatedCart = response.data;
    console.log(updatedCart);

    dispatch(setCart(updatedCart));
  } catch (error) {
    dispatch(
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
          ? error.message
          : "Something unexpected happened!!"
      )
    );
  }
};
