import type { Context } from "../node_modules/hono/dist/types/index.d.ts";
import { turso } from "./client.ts";

type EventRequest = {
  id?: number;
  item: string;
  type: string;
  date: string;
  status: string;
};

export async function addEvent(c: Context) {
  const req: EventRequest = await c.req.json();
  let id: number;
  const response = await turso
    .execute("select id from events order by id desc limit 1")
    .then((res) => {
      id = res.rows.length === 0 ? 0 : Number(res.rows[0].id) + 1;
      turso
        .execute({
          sql: "insert into events values (:id, :item, :event, :date, :status)",
          args: {
            id: Number(id),
            item: req.item,
            event: req.type,
            date: req.date,
            status: req.status,
          },
        })
        .then((r) => console.log(r));
      return id;
    });
  return c.json(response);
}

export async function editEvent(c: Context) {
  const req: EventRequest = await c.req.json();
  turso
    .execute({
      sql:
        "update events set item = :item, type = :event, date = :date, status = :status where id = :id",
      args: {
        id: Number(req.id),
        item: req.item,
        event: req.type,
        date: req.date,
        status: req.status,
      },
    })
    .then((r) => console.log(r));
}

export async function deleteEvent(c: Context) {
  const req: EventRequest = await c.req.json();
  turso
    .execute({
      sql: "delete from events where id = :id",
      args: {
        id: Number(req.id),
      },
    })
    .then((r) => console.log(r));
}

export async function getData(c: Context) {
  const req = c.req.query();
  const [startDate, endDate] = [req.startDate, req.endDate];

  const data = await turso
    .execute({
      sql:
        "select * from events where date >= :startDate and date < :endDate order by date desc",
      args: {
        startDate: startDate,
        endDate: endDate,
      },
    })
    .then((response) => {
      return response.rows;
    });
  return c.json(data);
}

export async function exportData(c: Context) {
  const req = c.req.query();
  const [startDate, endDate] = [req.startDate, req.endDate];

  const data = await turso
    .execute({
      sql:
        "select * from events where date >= :startDate and date < :endDate order by date desc",
      args: {
        startDate: startDate,
        endDate: endDate,
      },
    })
    .then((response) => {
      return response.rows;
    });
  return c.json(data);
}

export async function getLastCip(c: Context) {
  const data = await turso
    .execute(
      "select item, max(date) as date from events where type = 'CIP' group by item",
    )
    .then((res) => {
      return res.rows;
    });
  return c.json(data);
}
