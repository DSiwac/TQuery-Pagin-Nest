import { createRoot } from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainPage from "./pges/MainPage/MainPage.tsx";
import ProductPage from "./pges/ProductPage/ProductPage.tsx";
import ErrorPage from "./pges/ErrorPage/ErrorPage.tsx";
import CreateProd from "./pges/CreateProd/CreateProd.tsx";

const queryClient = new QueryClient();
const router = createBrowserRouter([
  { path: "/", element: <MainPage /> },
  {
    path: "/product/:productId",
    element: <ProductPage />,
  },
  {
    path: "/create",
    element: <CreateProd />,
  },
  { path: "*", element: <ErrorPage /> },
]);

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);
