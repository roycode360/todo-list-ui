import moment from "moment";

export const userTodos = [
  {
    id: "1",
    title: "Do yoyo",
    date: moment().add(0, "days").format("MMMM Do YYYY, h:mm:ss a"),
  },
  {
    id: "2",
    title: "50 push ups",
    date: moment().add(1, "days").format("MMMM Do YYYY, h:mm:ss a"),
  },
  {
    id: "3",
    title: "Order Pizza",
    date: moment().add(2, "days").format("MMMM Do YYYY, h:mm:ss a"),
  },
];
