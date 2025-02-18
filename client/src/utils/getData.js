import { getDateRange } from "./getDateRange.js";

export async function getData(date, width) {
  const [startDate, endDate] = getDateRange(date, width);

  const response = await fetch(
    import.meta.env.VITE_SERVER_URL + "/events" +
      `?startDate=${startDate}&endDate=${endDate}`,
    {
      method: "GET",
      credentials: "include",
    },
  )
    .then((res) => res.json());
  return response;
}

export async function exportData(startDate, endDate) {
  const response = await fetch(
    import.meta.env.VITE_SERVER_URL + "/events/export" +
      `?startDate=${startDate}&endDate=${endDate}`,
    {
      method: "GET",
      credentials: "include",
    },
  )
    .then((res) => res.json());
  return response;
}

export async function getLastCip() {
  const response = await fetch(
    import.meta.env.VITE_SERVER_URL + "/events/last-cip",
    {
      method: "GET",
      credentials: "include",
    },
  )
    .then((res) => res.json());
  return response;
}
