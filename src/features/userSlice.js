import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { url } from "../constants/variables";

const initialState = {
  userData: localStorage.getItem("todoListUserData")
    ? JSON.parse(localStorage.getItem("todoListUserData"))
    : {},
  status: "idle", // idle | loading | succeeded | failed
  error: {},
  selectedTodo: {},
  adding: false,
  deleting: false,
  fetching: false,
  updating: false,
  sort: "date",
  filter: "all",
  search: "",
};

export const signup = createAsyncThunk(
  "user/signup",
  async (googleAccessToken, { dispatch, getState }) => {
    try {
      const res = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {
            Authorization: `Bearer ${googleAccessToken}`,
          },
        }
      );
      const userData = {
        name: `${res.data.given_name} ${res.data.family_name}`,
        email: res.data.email,
        avatar: res.data.picture,
      };
      const { data } = await axios.post(`${url}/signup`, userData);
      return data;
    } catch (err) {
      return {
        errTitle: "Signin Failed",
        errMsg: err?.response?.data?.error ?? err.message,
      };
    }
  }
);

export const createTodo = createAsyncThunk(
  "user/createTodo",
  async (todo, { dispatch, getState }) => {
    try {
      const { token } = getState().user.userData;
      const { data } = await axios.post(`${url}/todo/create`, todo, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    } catch (err) {
      return {
        errTitle: "Could not create todo.",
        errMsg: err?.response?.data?.error ?? err.message,
      };
    }
  }
);

export const fetchTodos = createAsyncThunk(
  "user/fetchTodos",
  async (todos, { dispatch, getState }) => {
    try {
      const { token } = getState().user.userData;
      const { data } = await axios.post(
        `${url}/todo/fetch`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data;
    } catch (err) {
      return {
        errTitle: "Could not fetch todos.",
        errMsg: err?.response?.data?.error ?? err.message,
      };
    }
  }
);

export const deleteTodo = createAsyncThunk(
  "user/deleteTodo",
  async (id, { dispatch, getState }) => {
    try {
      const { token } = getState().user.userData;
      const { data } = await axios.post(
        `${url}/todo/delete/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data;
    } catch (err) {
      return {
        errTitle: "Could not delete todo.",
        errMsg: err?.response?.data?.error ?? err.message,
      };
    }
  }
);

export const updateTodo = createAsyncThunk(
  "user/updateTodo",
  async (todo, { dispatch, getState }) => {
    try {
      const { token } = getState().user.userData;
      const { data } = await axios.post(`${url}/todo/update/${todo.id}`, todo, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    } catch (err) {
      return {
        errTitle: "Could not update todo.",
        errMsg: err?.response?.data?.error ?? err.message,
      };
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateSelectedTodo(state, action) {
      state.selectedTodo = action.payload;
    },
    updateSort(state, action) {
      state.sort = action.payload;
    },
    updateFilter(state, action) {
      state.filter = action.payload;
    },
    updateSearch(state, action) {
      state.search = action.payload;
    },
    logout(state, action) {
      state.userData = {};
      localStorage.removeItem("todoListUserData");
    },
  },
  extraReducers(builder) {
    builder
      .addCase(signup.pending, (state, action) => {
        state.status = "pending";
        state.error = {};
      })
      .addCase(signup.fulfilled, (state, action) => {
        if (action.payload.errTitle) {
          state.error = action.payload;
          state.status = "failed";
        } else {
          state.status = "succeeded";
          state.userData = action.payload;
          state.error = {};
          //   store userData in localstorage
          localStorage.setItem(
            "todoListUserData",
            JSON.stringify({ ...action.payload })
          );
        }
      })
      .addCase(signup.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "failed";
      })
      .addCase(createTodo.pending, (state, action) => {
        state.adding = true;
        state.error = {};
      })
      .addCase(createTodo.fulfilled, (state, action) => {
        if (action.payload.errTitle) {
          state.error = action.payload;
          state.status = "failed";
          state.adding = false;
        } else {
          state.status = "succeeded";
          state.userData.todos = state.userData.todos.concat(action.payload);
          state.error = {};
          state.adding = false;
        }
      })
      .addCase(createTodo.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "failed";
        state.adding = false;
      })
      .addCase(fetchTodos.pending, (state, action) => {
        state.fetching = true;
        state.error = {};
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        if (action.payload.errTitle) {
          state.error = action.payload;
          state.status = "failed";
          state.fetching = false;
        } else {
          state.status = "succeeded";
          state.userData.todos = action.payload;
          state.error = {};
          state.fetching = false;
        }
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "failed";
        state.fetching = false;
      })
      .addCase(deleteTodo.pending, (state, action) => {
        state.deleting = true;
        state.error = {};
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        if (action.payload.errTitle) {
          state.error = action.payload;
          state.status = "failed";
          state.deleting = false;
        } else {
          state.status = "succeeded";
          state.userData.todos = state.userData.todos.filter(
            (todo) => todo.id !== `${action.payload}`
          );
          state.error = {};
          state.deleting = false;
        }
      })
      .addCase(deleteTodo.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "failed";
        state.deleting = false;
      })
      .addCase(updateTodo.pending, (state, action) => {
        state.updating = true;
        state.error = {};
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        if (action.payload.errTitle) {
          state.error = action.payload;
          state.status = "failed";
          state.updating = false;
          state.selectedTodo = {};
        } else {
          state.status = "succeeded";
          const todoIndex = state.userData.todos.findIndex(
            (todo) => todo.id === action.payload.id
          );
          state.userData.todos[todoIndex] = action.payload;
          state.error = {};
          state.updating = false;
          state.selectedTodo = {};
        }
      })
      .addCase(updateTodo.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "failed";
        state.updating = false;
        state.selectedTodo = {};
      });
  },
});

export const userDataSelect = (state) => state.user.userData;
export const selectSelectedTodo = (state) => state.user.selectedTodo;

export const {
  logout,
  updateSelectedTodo,
  updateSort,
  updateFilter,
  updateSearch,
} = userSlice.actions;

export default userSlice.reducer;
