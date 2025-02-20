import Button from "../../components/Button/Button";
import { usePosts } from "../../hooks/usePosts";
import styles from "./MainPage.module.css";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

function MainPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const sortBy = searchParams.get("sortBy") || "title";
  const sortOrder = searchParams.get("sortOrder") || "asc";

  const { data, isError } = usePosts({
    page,
    limit,
    sortBy,
    sortOrder,
  });

    const handleCreateClick = () => {
      navigate("/create"); 
    };

  const handlePageChange = (newPage: number) => {
    setSearchParams({
      page: String(newPage),
      limit: String(limit),
      sortBy,
      sortOrder,
    });
  };

  if (isError) {
    return <div>Произошла ошибка при загрузке данных.</div>;
  }

  const totalProducts = data?.total || 0;
  const totalPages = Math.ceil(totalProducts / limit);

  return (
    <>
      <div className={styles.pagination}>
        <Button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
        >
          Предыдущая
        </Button>
        <span>
          Страница: {page} из {totalPages}
        </span>
        <Button
          onClick={() => handlePageChange(page + 1)}
          disabled={
            !data || page * limit >= totalProducts || page >= totalPages
          }
        >
          Следующая
        </Button>
        <Button onClick={handleCreateClick}>+</Button>
      </div>
      <div className={styles.main}>
        {data?.products?.length ? (
          data.products.map((product) => (
            <Link
              to={`/product/${product.id}`}
              className={styles.cardLink}
              key={product.id}
            >
              <div className={styles.card}>
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
            </Link>
          ))
        ) : (
          <div>Нет товаров, соответствующих выбранным критериям.</div>
        )}
      </div>
    </>
  );
}

export default MainPage;
