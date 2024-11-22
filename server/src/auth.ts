import { deleteCookie, getSignedCookie, setSignedCookie } from "hono/cookie";
import { randomUUID } from "crypto";
import { turso } from "./client.ts";
import type { Context } from "../node_modules/hono/dist/types/context.d.ts";

type Session = {
  isAuthenticated: boolean | null;
  user: string | null;
};

const secret: string = process.env.MY_SECRET || "bad secret";

const users = [
  {
    username: process.env.ADMIN_USER,
    password: process.env.ADMIN_PASSWORD,
  },
];

export const authenticate = async (c: Context) => {
  const user = await c.req.json();

  const verifiedUser = users.find((u) => u.username === user.username);

  if (verifiedUser && verifiedUser.password === user.password) {
    const sessionId = randomUUID();
    const expiry = new Date(new Date().setDate(new Date().getDate() + 30));
    const userName = user.username;
    try {
      await turso.execute({
        sql:
          `INSERT INTO sessions(sessionId, user, expires) VALUES(:sessionId,:userName,:expiry);`,
        args: { sessionId, userName, expiry: expiry.toISOString() },
      });
    } catch (error) {
      console.log(error);
    }
    await setSignedCookie(c, "sessionId", sessionId, secret, {
      expires: expiry,
    });
    return c.json({ isAuthenticated: true, user: verifiedUser.username });
  } else {
    return c.json({
      isAuthenticated: false,
      user: null,
      message: "Invalid username or password",
    });
  }
};

export const checkCookie = async (c: Context) => {
  const cookie = await getSignedCookie(c, secret);
  let session: Session = {
    isAuthenticated: false,
    user: null,
  };

  if (cookie) {
    try {
      await turso.execute(
        `delete from sessions where date(expires) < date('now');`,
      );
      session = await turso.execute({
        sql: `select * from sessions where sessionId = :session;`,
        args: { session: cookie.sessionId },
      });
    } catch (error) {
      console.log(error);
    }
  }
  if (session && session.user !== null) {
    return c.json({ isAuthenticated: true, user: session.user });
  } else {
    return c.json({ isAuthenticated: false, user: null });
  }
};

export const signOut = async (c: Context) => {
  const cookie = await getSignedCookie(c, secret);
  const sessionId = cookie.sessionId;
  try {
    await turso.execute({
      sql: `delete from sessions where sessionId = :sessionId`,
      args: { sessionId },
    });
  } catch (error) {
    console.log(error);
  }
  deleteCookie(c, "sessionId");
  return c.json(<Session>{ isAuthenticated: false, user: null });
};
