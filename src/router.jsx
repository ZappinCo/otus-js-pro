import { createBrowserRouter } from "react-router"
import { App } from "./App";
import { Loader } from "./components/Loader";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
      HydrateFallback: () => <Loader />,
      children: [
        {
          index: true,
          lazy: async () => {
            const { default: Component } = await import("./pages/MainPage");
            return { Component };
          },
        },
        {
          path: "about",
          lazy: async () => {
            const { default: Component } = await import("./pages/AboutPage");
            return { Component };
          },
        },
        {
          path: "articles",
          lazy: async () => {
            const { default: Component } = await import("./pages/ArticlesPage");
            return { Component };
          },
        },
        {
          path: "articles/:id",
          lazy: async () => {
            const { default: Component } = await import("./pages/OneArticlePage");
            return { Component };
          },
        },
        {
          path: "login", lazy: async () => {
            const { default: Component } = await import("./pages/LoginPage");
            return { Component };
          },
        },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL }
)