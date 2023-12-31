import { UrlParser } from "./utils/url-parser.js";
import { Database } from "./middlewares/database.js";
import { randomUUID } from "node:crypto";

const database = new Database();

export const routes = [
  {
    method: "GET",
    path: "/tasks",
    handler: (req, res) => {
      const { search } = req.queryParams;

      const tasks = database.select(
        "tasks",
        search
          ? {
              title: search,
              description: search,
            }
          : null
      );

      if (tasks.length > 0) {
        return res
          .setHeader("Content-Type", "application/json")
          .writeHead(200)
          .end(JSON.stringify(tasks));
      }

      return res
        .setHeader("Content-Type", "application/json")
        .writeHead(404)
        .end();
    },
  },
  {
    method: "POST",
    path: "/tasks",
    handler: (req, res) => {
      const id = randomUUID();

      database.insert("tasks", {
        id: id,
        created_at: new Date(),
        updated_at: null,
        completed_at: null,
        ...req.body,
      });
      return res
        .setHeader("Content-Type", "application/json")
        .writeHead(201)
        .end(JSON.stringify({ id }));
    },
  },
  {
    method: "PUT",
    path: "/tasks/:id",
    handler: (req, res) => {
      const id = req.params.id;

      const [task] = database.select("tasks", { id });
      if (!task) {
        return res.writeHead(404).end();
      }

      database.update("tasks", id, req.body);
      return res.writeHead(204).end();
    },
  },
  {
    method: "PATCH",
    path: "/tasks/:id/complete",
    handler: (req, res) => {
      const id = req.params.id;

      const [task] = database.select("tasks", { id });
      console.log(task);
      if (!task) {
        return res.writeHead(404).end();
      }

      database.patch("tasks", id);
      return res.writeHead(204).end();
    },
  },
  {
    method: "DELETE",
    path: "/tasks/:id",
    handler: (req, res) => {
      const id = req.params.id;

      const [task] = database.select("tasks", { id });
      if (!task) {
        return res.writeHead(404).end();
      }

      database.delete("tasks", id);
      return res.writeHead(200).end();
    },
  },
];
