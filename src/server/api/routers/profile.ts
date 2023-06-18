import { clerkClient } from "@clerk/nextjs";
import { TRPCError } from "@trpc/server";

import { z } from "zod";
import { observable } from "@trpc/server/observable";

import {
  adminProcedure,
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
// import { EventEmitter } from "stream";

// const eventEmitter = new EventEmitter

export const profileRouter = createTRPCRouter({
  getUserByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ input }) => {
      const [user] = await clerkClient.users.getUserList({
        username: [input.username],
      });

      if (!user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User not found",
        });
      }

      // eventEmitter.emit("update", "some dummy data")

      return JSON.parse(JSON.stringify(user));
    }),

  secretData: adminProcedure.query(({ ctx }) => {
    console.log("ctx:", ctx);
    return "Super top secret admin data";
  }),

  // onUpdate: publicProcedure.subscription(() => {
  //   return observable<string>(emit => {
  //     eventEmitter.on("update", emit.next)

  //     return () => {
  //       eventEmitter.off("update", emit.next)
  //     }
  //   })
  // })
});
