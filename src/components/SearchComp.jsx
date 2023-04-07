import React from "react";
import { useDispatch } from "react-redux";
import { updateSearch } from "../features/userSlice";

const SearchComp = () => {
  const dispatch = useDispatch();
  return (
    <div className="searchComp">
      <input
        className="searchComp__input"
        placeholder="search todos"
        onChange={(e) => {
          dispatch(updateSearch(e.target.value));
        }}
      />
    </div>
  );
};

export default SearchComp;
