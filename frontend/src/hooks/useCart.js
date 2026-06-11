import useCartStore from '../store/cartStore';
import toast from 'react-hot-toast';

const useCart = () => {
  const { items, addItem, removeItem, clearCart, getTotal, getItemCount } = useCartStore();

  const handleAddToCart = (product) => {
    const exists = items.find((item) => item._id === product._id);
    if (exists) {
      toast.error('Already in cart');
      return;
    }
    addItem(product);
    toast.success('Added to cart');
  };

  const handleRemoveFromCart = (productId) => {
    removeItem(productId);
    toast.success('Removed from cart');
  };

  return {
    items,
    total: getTotal(),
    itemCount: getItemCount(),
    addToCart: handleAddToCart,
    removeFromCart: handleRemoveFromCart,
    clearCart,
  };
};

export default useCart;
