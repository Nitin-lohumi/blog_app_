import { postRouter } from "./router/post";
import { router } from "./trpc";
import { postCategoryRouter } from "./router/Post_Categories";
import { categoryRouter } from "./router/categories";

export const appRouter = router({
  post: postRouter,
  postCategory: postCategoryRouter,
  categories: categoryRouter,
});

export type AppRouter = typeof appRouter;
