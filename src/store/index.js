import { applyMiddleware, compose, createStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import reducer from "../reducers";

const store = createStore(reducer, compose(applyMiddleware(thunk)));

export default store;
