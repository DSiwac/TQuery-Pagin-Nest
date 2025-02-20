import { useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import styles from "./ErrorPage.module.css";

function ErrorPage() {
  const navigate = useNavigate();

  const handleMainPage = () => {
    navigate("/");
  };

  return (
    <div className={styles.errorPage}>
      <h1 className={styles.errorTitle}>Что-то пошло не так!</h1>
      <p className={styles.errorMessage}>
        К сожалению, произошла ошибка. Попробуйте обновить страницу или
        вернуться на главную.
      </p>
      <Button className={styles.homeButton} onClick={handleMainPage}>
        На главную
      </Button>
    </div>
  );
}

export default ErrorPage;
