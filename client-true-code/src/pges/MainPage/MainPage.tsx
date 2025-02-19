import { useQuery } from "@tanstack/react-query";
import getData from "../../api/api";
import { ApiResponseInterface } from "../../components/Interface/interface";

function MainPage() {
  const { data, error, isSuccess } = useQuery<ApiResponseInterface>({
    queryKey: ["products"],
    queryFn: getData,
  });

  console.log("MainPage - data:", data);
  console.log("MainPage - isSuccess:", isSuccess);
  console.log("MainPage - error:", error);

  return (
    <>
      <div className="main">
        {data?.products?.length
          ? data.products.map((product) => (
              <div key={product.id}>{product.title}</div>
            ))
          : "Не найдено"}
      </div>
    </>
  );
}

export default MainPage;
