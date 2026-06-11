import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as orderService from '../services/order.service';

export const useMyOrders = (params = '') => {
  return useQuery({
    queryKey: ['myOrders', params],
    queryFn: () => orderService.getMyOrders(params),
  });
};

export const useOrder = (id) => {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => orderService.getOrder(id),
    enabled: !!id,
  });
};

export const useSellerOrders = (params = '') => {
  return useQuery({
    queryKey: ['sellerOrders', params],
    queryFn: () => orderService.getSellerOrders(params),
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: orderService.createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myOrders'] });
    },
  });
};
