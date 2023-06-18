import { createNextApiHandler } from "@trpc/server/adapters/next";
import { applyWSSHandler } from "@trpc/server/adapters/ws";

import { env } from "~/env.mjs";
import { appRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";

import ws from "ws";

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
  onError:
    env.NODE_ENV === "development"
      ? ({ path, error }) => {
          console.error(
            `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`
          );
        }
      : undefined,
});

// const wss = new ws.Server({
//   port: 3001,
// });

// https://github.com/trpc/examples-next-prisma-websockets-starter/tree/main
