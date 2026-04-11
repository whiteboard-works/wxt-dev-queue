import consola from "consola";
import { createApp } from "@aklinker1/zeta";
import { corsPlugin } from "./plugins/cors-plugin";
import { graphqlRoutes } from "./routes/grpahql-routes";
import { restRoutes } from "./routes/rest-routes";
import { zodSchemaAdapter } from "@aklinker1/zeta/adapters/zod-schema-adapter";
import { version } from "../package.json";
import { z } from "zod";
import dedent from "dedent";

const app = createApp({
  schemaAdapter: zodSchemaAdapter,
  openApi: {
    info: {
      title: "WXT Queue API Reference",
      version,
      description: dedent`
        # Overview

        As of right now, the WXT Queue API is free to use with no authentication
        requirements.

        > [!IMPORTANT]
        > If you want to keep it this way, **be respectful of how you use it**.
        > Do not spam or abuse it.

        <br/>

        ## REST vs GraphQL

        The WXT Queue API is mostly a GraphQL API, with a few REST endpoints.
        This document covers all the REST endpoints, including the one used to
        make GraphQL requests.
      `,
    },
    tags: [
      {
        name: "GraphQL",
        description: dedent`
          To play around with the GraphQL API, checkout the
          [GraphiQL Playground](/playground).
        `,
      },
      { name: "Chrome Extensions" },
      { name: "Firefox Addons" },
      { name: "System" },
    ],
  },
})
  .onGlobalError(({ error }) => void consola.error(error))
  .use(corsPlugin)
  .use(restRoutes)
  .use(graphqlRoutes)
  .get(
    "/",
    {
      summary: "API Docs Redirect",
      tags: ["System"],
      description: "Redirect to the API reference when visiting the root URL.",
    },
    ({ set }) => {
      set.status = 302;
      set.headers.Location = "/scalar";
    },
  )
  .get(
    "/api/health",
    {
      summary: "Health Check",
      tags: ["System"],
      description: "Used to make sure the API is up and running.",
      responses: z.object({
        status: z.literal("ok"),
        version: z.string(),
      }),
    },
    () => ({ status: "ok" as const, version }),
  );

export default app;
export type App = typeof app;
