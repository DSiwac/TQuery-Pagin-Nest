import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import styles from "./CreateProd.module.css";

interface ProductInterface {
  title: string;
  description: string;
  price: number;
  images: string[];
  discountPercentage: number;
}

function CreateProd() {
  const [product, setProduct] = useState<ProductInterface>({
    title: "",
    description: "",
    price: 0,
    images: [],
    discountPercentage: 0,
  });

  const [imageInput, setImageInput] = useState("");
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImageAdd = () => {
    if (imageInput.trim() !== "") {
      setProduct({ ...product, images: [...product.images, imageInput] });
      setImageInput("");
    }
  };

  const handleImageRemove = (index: number) => {
    const newImages = [...product.images];
    newImages.splice(index, 1);
    setProduct({ ...product, images: newImages });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/products/create", product);
      navigate("/");
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  return (
    <div className={styles.createProd}>
      <h1>Добавить новый продукт</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label htmlFor="title">Название</label>
        <input
          type="text"
          id="title"
          name="title"
          value={product.title}
          onChange={handleChange}
          required
        />

        <label htmlFor="description">Описание:</label>
        <textarea
          id="description"
          name="description"
          value={product.description}
          onChange={handleChange}
        />

        <label htmlFor="price">Цена:</label>
        <input
          type="number"
          id="price"
          name="price"
          value={product.price}
          onChange={handleChange}
          required
        />

        <label>Картинка:</label>
        <div className={styles.imageInputs}>
          <input
            type="text"
            placeholder="Image URL"
            value={imageInput}
            onChange={(e) => setImageInput(e.target.value)}
          />
          <Button type="button" onClick={handleImageAdd}>
            Добавить
          </Button>
        </div>
        <div className={styles.imageList}>
          {product.images.map((image, index) => (
            <div key={index} className={styles.imageItem}>
              <img src={image} alt={`Product Image ${index + 1}`} />
              <Button type="button" onClick={() => handleImageRemove(index)}>
                Удалить
              </Button>
            </div>
          ))}
        </div>

        <label htmlFor="discountPercentage">Скидка:</label>
        <input
          type="number"
          id="discountPercentage"
          name="discountPercentage"
          value={product.discountPercentage}
          onChange={handleChange}
        />

        <Button type="submit">Создать</Button>
      </form>
    </div>
  );
}

export default CreateProd;
