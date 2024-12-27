import { useState, useEffect } from 'react';
import axios from 'axios';

const useCartData = (userId: number) => {
  const [items, setItems] = useState<any[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [cartCount, setCartCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/cart/${userId}`);
        //console.log('Id',userId);
        setItems(response.data.cartItems);
        setTotalAmount(response.data.totalAmount);

        // Calculate the total number of items in the cart
        const totalItems = response.data.cartItems.reduce(
          (total: number, item: any) => total + 1,
          0
        );
        setCartCount(totalItems);
      } catch (error) {
        console.error('Error fetching cart data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
  }, [userId]);

  return { items, totalAmount, cartCount, loading };
};

export default useCartData;
