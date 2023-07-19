import moment from "moment";

export const getTimeAbsolute = (time: string) => {
  return moment(time).format("h:mm:ss a, MMMM D YYYY");
}

export const getTimeRelative = (time: string) => {
  return moment(time).startOf('second').fromNow();
}

export const getDateAbsolute = (time: string) => {
  return moment(time).format("MMMM D, YYYY");
}