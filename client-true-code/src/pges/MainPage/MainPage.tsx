import { useQuery } from "@tanstack/react-query";
import getData from "../../api/api";
import { ApiResponseInterface } from "../../components/Interface/interface";
import styles from "./MainPage.module.css";

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
      <div className={styles.main}>
        {data?.products?.length
          ? data.products.map((product) => (
              <div className={styles.card} key={product.id}>
                <div className={styles.imageContainer}>
                  {product.images && product.images.length > 0 && (
                    <img
                      className={styles.photo}
                      src={product.images[0]}
                      alt={product.title}
                    />
                  )}
                </div>
                <div className={styles.details}>
                  <h2 className={styles.title}>{product.title}</h2>
                  <p className={styles.price}>${product.price}</p>
                  <p className={styles.description}>{product.description}</p>
                  <p className={styles.discount}>
                    Скидка: {product.discountPercentage}%
                  </p>
                </div>
              </div>
            ))
          : "Не найдено"}
      </div>
    </>
  );
}

export default MainPage;
