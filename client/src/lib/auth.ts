export async function checkCookie() {
  const response = await fetch("http://localhost:3000/auth/cookie", {
    credentials: "include",
  })
    .then((res) => res.json());
  return response;
}

export async function signIn(username: string, password: string) {
  const user = { username: username, password: password };
  const response = await fetch("http://localhost:3000/auth/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
    credentials: "include",
  })
    .then((res) => res.json());
  return response;
}

export async function signOut() {
  const response = await fetch("http://localhost:3000/auth/signout", {
    credentials: "include",
  }).then((res) => res.json());
  return response;
}
