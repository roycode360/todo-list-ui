import moment from "moment";
import React from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useDispatch } from "react-redux";
import { deleteTodo, updateSelectedTodo } from "../features/userSlice";

const TodoList = ({ id, title, date, priority, todo }) => {
  const dispatch = useDispatch();
  return (
    <div className="todoList">
      <div className="todoList__button">
        <div className={`todoList__priority--${priority}`}></div>
      </div>
      <div className="todoList__title">{title}</div>
      <div className="todoList__actions">
        <div className="todoList__actions--icons">
          <FaEdit
            className="todoList__actions--icons-edit"
            onClick={() => {
              dispatch(updateSelectedTodo(todo));
            }}
          />
          <MdDelete
            className="todoList__actions--icons-delete"
            onClick={() => {
              dispatch(deleteTodo(id));
            }}
          />
        </div>
        <div className="todoList__date">
          Due date: {moment(date).format("DD/MMMM/YYYY")}
        </div>
      </div>
    </div>
  );
};

export default TodoList;
