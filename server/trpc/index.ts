import { postRouter } from "./router/post";
import { router } from "./trpc";
import { categoryRouter } from "./router/categories";

export const appRouter = router({
  post: postRouter,
  categories: categoryRouter,
});

export type AppRouter = typeof appRouter;
