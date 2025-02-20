import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./ProductPage.module.css";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Button from "../../components/Button/Button";
import { ProductInterface } from "../../components/Interface/interface";



const ProductPage = () => {
  const { productId } = useParams<{ productId: string}>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState<ProductInterface | null>(
    null
  );

  const { isLoading, error, data } = useQuery<ProductInterface>({
    queryKey: ["product", productId],
    queryFn: async () => {
      const response = await axios.get<ProductInterface>(
        `http://localhost:3000/products/${productId}`
      );
      return response.data;
    },
    enabled: !!productId,
  });

  const updateProductMutation = useMutation({
    mutationFn: async (updatedProduct: ProductInterface) => {
      await axios.put(
        `http://localhost:3000/products/${productId}`,
        updatedProduct
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
      setIsEditing(false);
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async () => {
      await axios.delete(`http://localhost:3000/products/${productId}`);
    },
    onSuccess: () => {
      navigate("/");
    },
  });

  useEffect(() => {
    if (data) {
      setEditedProduct(data);
    }
  }, [data]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (!editedProduct) return;
    setEditedProduct({ ...editedProduct, [name]: value });
  };

  const handleSaveClick = () => {
    if (editedProduct) {
      updateProductMutation.mutate(editedProduct);
    }
  };

  const handleDeleteClick = () => {
    deleteProductMutation.mutate();
  };

  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка загрузки товара.</div>;
  if (!data) return <div>Товар не найден.</div>;

  return (
    <div className={styles.productPage}>
      {isEditing ? (
        <div className={styles.editForm}>
          <input
            className={styles.input}
            type="text"
            name="title"
            value={editedProduct?.title || ""}
            onChange={handleInputChange}
            placeholder="Title"
          />
          <textarea
            className={styles.textarea}
            name="description"
            value={editedProduct?.description || ""}
            onChange={handleInputChange}
            placeholder="Description"
          />
          <input
            className={styles.input}
            type="number"
            name="price"
            value={String(editedProduct?.price || "")}
            onChange={handleInputChange}
            placeholder="Price"
          />
          <div className={styles.editButtons}>
            <Button onClick={handleSaveClick}>Save</Button>
            <Button onClick={() => setIsEditing(false)}>Cancel</Button>
          </div>
        </div>
      ) : (
        <div className={styles.productDetails}>
          <h1 className={styles.title}>{data.title}</h1>
          <img src={data.images[0]} alt={data.title} className={styles.photo} />
          <p className={styles.description}>{data.description}</p>
          <p className={styles.price}>Price: ${data.price}</p>
          <p className={styles.discount}>
            Discount: {data.discountPercentage}%
          </p>

          <div className={styles.buttons}>
            <Button onClick={handleEditClick}>Edit</Button>
            <Button onClick={handleDeleteClick}>Delete</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
