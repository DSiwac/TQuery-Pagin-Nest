import { useQuery } from "@tanstack/react-query";
import {
  ApiResponseInterface,
  UsePostsOptions,
} from "../components/Interface/interface";
import getData from "../api/api";
import { useEffect } from "react";

export function usePosts(options: UsePostsOptions = {}) {
  const {
    page = 1,
    limit = 8,
    sortBy = "title",
    sortOrder = "asc",
    ...filters
  } = options;

  const queryParams = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    sortBy: sortBy,
    sortOrder: sortOrder,
    ...filters,
  }).toString();

  const { data, isError, isSuccess, refetch } = useQuery<ApiResponseInterface>({
    queryKey: ["products", page, limit, sortBy, sortOrder, filters],
    queryFn: () => getData(queryParams),
  });

  useEffect(() => {
    if (isSuccess) console.log("Данные получили");
  }, [isSuccess, data]);
  useEffect(() => {
    if (isError) console.log("Ошибка в получении данных");
  }, [isError]);

  console.log("MainPage - data:", data);
  console.log("MainPage - isSuccess:", isSuccess);
  console.log("MainPage - error:", isError);

  refetch();

  return { data, isError, isSuccess };
}
