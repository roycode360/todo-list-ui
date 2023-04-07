import React, { useEffect, useState } from "react";
import SearchComp from "../components/SearchComp";
// import { userTodos } from "../mock/todoData";
import TodoList from "../components/TodoList";
import { useDispatch, useSelector } from "react-redux";
import {
  createTodo,
  logout,
  selectSelectedTodo,
  updateFilter,
  updateSort,
  updateTodo,
  userDataSelect,
} from "../features/userSlice";
import { Navigate } from "react-router-dom";
import moment from "moment";

const Home = () => {
  const dispatch = useDispatch();
  const user = useSelector(userDataSelect);
  const fetching = useSelector((state) => state.user.fetching);
  const adding = useSelector((state) => state.user.adding);
  const deleting = useSelector((state) => state.user.deleting);
  const updating = useSelector((state) => state.user.updating);
  const error = useSelector((state) => state.user.error);
  const sort = useSelector((state) => state.user.sort);
  const filter = useSelector((state) => state.user.filter);
  const search = useSelector((state) => state.user.search);
  const { token, todos } = useSelector(userDataSelect);
  const selectedTodo = useSelector(selectSelectedTodo);

  const [todoList, setTodoList] = useState(todos);
  const [date, setDate] = useState(Date.now());
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("low");

  useEffect(() => {
    if (token) {
      // sorting
      let sortedList = [...todos];
      if (sort === "date") {
        sortedList = sortedList.sort((a, b) => a?.date - b?.date);
      } else if (sort === "title") {
        sortedList.sort((a, b) => a?.title.localeCompare(b?.title));
      } else if (sort === "created") {
        sortedList.sort((a, b) => Number(a?.id) - Number(b?.id));
      }

      //filtering
      if (filter === "all") {
        // do nothing just same sorted list from above
      } else if (filter === "low") {
        sortedList = sortedList.filter((todo) => todo.priority === "low");
      } else if (filter === "medium") {
        sortedList = sortedList.filter((todo) => todo.priority === "medium");
      } else if (filter === "high") {
        sortedList = sortedList.filter((todo) => todo.priority === "high");
      }

      // search
      if (search) {
        sortedList = sortedList.filter((todo) => todo.title.includes(search));
      }

      setTodoList(sortedList);
    }

    // update selected todo
    if (selectedTodo.title && selectedTodo.date) {
      setDate(selectedTodo.date);
      setTitle(selectedTodo.title);
      setPriority(selectedTodo.priority);
    }
  }, [selectedTodo, sort, filter, todos, token, search]);

  // protect route
  if (!token) {
    return <Navigate to="/signup" />;
  }

  return (
    <div className="home">
      <div className="home__user">
        <img
          className="home__user--img"
          src={user.avatar || "/images/user-img.jpg"}
          alt="User Img"
        />
        <h2 className="home__user--name">{user.name}</h2>
      </div>
      <div className="home__logout">
        <button
          onClick={() => {
            dispatch(logout());
          }}
          className="home__logout-btn"
        >
          Logout
        </button>
      </div>
      <div className="home__wrapper">
        <div className="home__card">
          <div className="home__header">To-do List</div>
          <div className="home__row">
            <div>
              <span>Filter:</span>
              <select
                value={filter}
                onChange={(e) => {
                  dispatch(updateFilter(e.target.value));
                }}
              >
                <option value={"all"}>All</option>
                <option value={"low"}>Low</option>
                <option value={"medium"}>Medium</option>
                <option value={"high"}>High</option>
              </select>
            </div>
            <div>
              <span>Sort:</span>
              <select
                value={sort}
                onChange={(e) => {
                  dispatch(updateSort(e.target.value));
                }}
              >
                <option value={"date"}>Due date</option>
                <option value={"title"}>Title</option>
                <option value={"created"}>Created</option>
              </select>
            </div>
          </div>
          <SearchComp />
          <div className="home__list">
            {todos.length !== 0 ? (
              todoList.map((todo) => (
                <TodoList
                  key={todo.id}
                  id={todo.id}
                  title={todo.title}
                  date={todo.date}
                  todo={todo}
                  priority={todo.priority}
                />
              ))
            ) : fetching ? (
              <p className="home__list--text">Loading...</p>
            ) : (
              <p className="home__list--text">To-do list empty...</p>
            )}
          </div>
          {adding ? (
            <div className="home__title">Adding todo...</div>
          ) : deleting ? (
            <div className="home__title">Deleting todo...</div>
          ) : updating ? (
            <div className="home__title">Updating todo...</div>
          ) : error.errTitle ? (
            <div
              style={{ color: "rgb(248, 123, 123)" }}
              className="home__title"
            >
              {error.errTitle} {error.errMsg}
            </div>
          ) : (
            <div className="home__title">Add new todo...</div>
          )}
          <div className="home__actions">
            <div className="home__actions--add">
              <input
                className="home__input"
                placeholder="Todo title"
                required={true}
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
                onKeyUp={(e) => {
                  if (e.key === "Enter") {
                    if (title && date) {
                      if (selectedTodo.title && selectedTodo.date) {
                        dispatch(
                          updateTodo({
                            id: selectedTodo.id,
                            title,
                            date,
                            priority,
                          })
                        );
                      } else {
                        dispatch(
                          createTodo({
                            id: `${Date.now()}`,
                            title,
                            date: Date.now(),
                            priority,
                          })
                        );
                      }
                    }
                    setDate(Date.now());
                    setTitle("");
                  }
                }}
              />
            </div>
            <div className="home__row">
              <div>
                <span>Due date:</span>
                <input
                  type="date"
                  className="home__date"
                  value={moment(date).format("YYYY-MM-DD")}
                  onChange={(e) => {
                    const date = new Date(e.target.value).getTime();
                    setDate(date);
                  }}
                />
              </div>
              <div>
                <span>Priority:</span>
                <select
                  value={priority}
                  onChange={(e) => {
                    setPriority(e.target.value);
                  }}
                >
                  <option style={{ color: "green" }} value={"low"}>
                    Low
                  </option>
                  <option style={{ color: "orange" }} value={"medium"}>
                    Medium
                  </option>
                  <option style={{ color: "red" }} value={"high"}>
                    High
                  </option>
                </select>
              </div>
            </div>
            <button
              className="home__actions--btn"
              onClick={() => {
                if (title && date) {
                  if (selectedTodo.title && selectedTodo.date) {
                    dispatch(
                      updateTodo({
                        id: selectedTodo.id,
                        title,
                        date,
                        priority,
                      })
                    );
                  } else {
                    dispatch(
                      createTodo({
                        id: `${Date.now()}`,
                        title,
                        date: Date.now(),
                        priority,
                      })
                    );
                  }
                }
                setDate(Date.now());
                setTitle("");
              }}
            >
              Add Todo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
