import { deleteCookie, getSignedCookie, setSignedCookie } from "hono/cookie";
import { randomUUID } from "crypto";
import { Database } from "bun:sqlite";
import type { Context } from "../node_modules/hono/dist/types/context.d.ts";

type Session = {
  isAuthenticated: boolean | null;
  user: string | null;
};

const secret: string = Bun.env.MY_SECRET || "bad secret";

const users = [
  {
    username: "logno",
    password: "thesameasyours",
  },
];

let db: Database;

export const authenticate = async (c: Context) => {
  const user = await c.req.json();

  const verifiedUser = users.find((u) => u.username === user.username);

  if (verifiedUser && verifiedUser.password === user.password) {
    const sessionId = randomUUID();
    const expiry = new Date(new Date().setDate(new Date().getDate() + 30));
    const userName = user.username;
    try {
      db = new Database("db.sqlite", { strict: true });
      const query = db.prepare(
        `INSERT INTO sessions(sessionId, user, expires) VALUES(:sessionId,:userName,:expiry);`,
      );
      query.run({ sessionId, userName, expiry: expiry.toISOString() });
    } catch (error) {
      console.log(error);
    } finally {
      if (db) db.close();
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
      db = new Database("db.sqlite", { strict: true });
      const expireCheck = db.prepare(
        `delete from sessions where date(expires) < date('now');`,
      );
      expireCheck.run();
      const query = db.prepare(
        `select * from sessions where sessionId = :session;`,
      );
      session = <Session>query.get({ session: cookie.sessionId });
    } catch (error) {
      console.log(error);
    } finally {
      if (db) db.close();
    }
  }
  if (session.user !== null) {
    return c.json({ isAuthenticated: true, user: session.user });
  } else {
    return c.json({ isAuthenticated: false, user: null });
  }
};

export const signOut = async (c: Context) => {
  const cookie = await getSignedCookie(c, secret);
  const sessionId = cookie.sessionId;
  try {
    db = new Database("db.sqlite", { strict: true });
    const query = db.prepare(
      `delete from sessions where sessionId = :sessionId`,
    );
    query.run({ sessionId });
  } catch (error) {
    console.log(error);
  } finally {
    if (db) db.close();
  }
  deleteCookie(c, "sessionId");
  return c.json(<Session>{ isAuthenticated: false, user: null });
};
