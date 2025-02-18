export async function addEvent(e) {
  const response = await fetch(
    import.meta.env.VITE_SERVER_URL + "/events/add",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(e),
      credentials: "include",
    },
  )
    .then((res) => res.json());
  return response;
}

export async function editEvent(e) {
  const response = await fetch(
    import.meta.env.VITE_SERVER_URL + "/events/edit",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(e),
      credentials: "include",
    },
  )
    .then((res) => res.json());
  return response;
}

export async function deleteEvent(e) {
  const response = await fetch(
    import.meta.env.VITE_SERVER_URL + "/events/delete",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: e }),
      credentials: "include",
    },
  )
    .then((res) => res.json());
  return response;
}
