import { createSlice } from "@reduxjs/toolkit";
import { axiosEcommerce, getConfig } from "../../utils/configAxios";

const initialState = {
    products: [],
    error: false
}

const cardSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        setProductsCartGlobal: (state, action) => {
            return {...state, products: action.payload}
        },
        setChangeErrorStatus: (state) => {
            return {...state, error: !state.error}
        }
    }
})

export const {setProductsCartGlobal, setChangeErrorStatus} = cardSlice.actions;

export const getAllCartProducts = () => (dispatch) => {
    axiosEcommerce
    .get('/cart', getConfig())
    .then((res) => dispatch(setProductsCartGlobal(res.data)))
    .catch((err) => console.log(err))
}

export const AddProductCart = (data) => (dispatch) => {
    axiosEcommerce
    .post('/cart', data, getConfig())
    .then((res) => dispatch(getAllCartProducts()))
    .catch((err) => {
        console.log(err)
        if (err.response.data?.error === 'Product already added to cart') {
            dispatch(setChangeErrorStatus())
            setTimeout(() => {
                dispatch(setChangeErrorStatus())
            }, 3000)
        }
    })
}

export const deleteProductCart = (id) => (dispatch) => {
    axiosEcommerce
    .delete(`/cart/${id}`, getConfig())
    .then((res)=> dispatch(getAllCartProducts()))
    .catch((err)=> console.log(err))
}

export const updateProductCart = (id, data) => (dispatch) => {
    axiosEcommerce
    .put(`/cart/${id}`, data, getConfig())
    .then((res) => dispatch(getAllCartProducts()))
    .catch((err) => console.log(err))
}

export const purchaseCart = () => (dispatch) => {
    axiosEcommerce
    .post('/purchases', {}, getConfig())
    .then((res) => dispatch(setProductsCartGlobal([])))
    .catch((err) => console.log(err))
}

export default cardSlice.reducer