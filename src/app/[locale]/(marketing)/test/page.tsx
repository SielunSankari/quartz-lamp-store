'use client';

import { useEffect, useState } from 'react';

type Order = {
  id: number;
  user_id: number;
  created_at: string;
  items?: OrderItem[];
  total_amount?: number;
};

type OrderItem = {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
  image_url: string;
};

export default function TestPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, itemsRes] = await Promise.all([
          fetch('http://localhost:3001/orders').then(res => res.json()),
          fetch('http://localhost:3001/order-items').then(res => res.json()),
        ]);

        setOrders(ordersRes);
        setOrderItems(itemsRes);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleOrderClick = async (orderId: number) => {
    try {
      const response = await fetch(`http://localhost:3001/orders/${orderId}`);
      const orderData = await response.json();
      setSelectedOrder(orderData);
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-8">Orders Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Orders Summary</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 border">Order ID</th>
                    <th className="py-2 px-4 border">User ID</th>
                    <th className="py-2 px-4 border">Date</th>
                    <th className="py-2 px-4 border">Items Count</th>
                    <th className="py-2 px-4 border">Total</th>
                    <th className="py-2 px-4 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleOrderClick(order.id)}
                    >
                      <td className="py-2 px-4 border">{order.id}</td>
                      <td className="py-2 px-4 border">{order.user_id}</td>
                      <td className="py-2 px-4 border">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-4 border">
                        {orderItems.filter(item => item.order_id === order.id).length}
                      </td>
                      <td className="py-2 px-4 border">
                        {orderItems
                          .filter(item => item.order_id === order.id)
                          .reduce((sum, item) => sum + (item.price * item.quantity), 0)
                          .toFixed(2)}
                        {' '}
                        ₸
                      </td>
                      <td className="py-2 px-4 border">
                        <button
                          className="text-blue-600 hover:text-blue-800"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOrderClick(order.id);
                          }}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">All Order Items</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 border">ID</th>
                    <th className="py-2 px-4 border">Order ID</th>
                    <th className="py-2 px-4 border">Product</th>
                    <th className="py-2 px-4 border">Quantity</th>
                    <th className="py-2 px-4 border">Price</th>
                    <th className="py-2 px-4 border">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems.map(item => (
                    <tr key={item.id}>
                      <td className="py-2 px-4 border">{item.id}</td>
                      <td className="py-2 px-4 border">{item.order_id}</td>
                      <td className="py-2 px-4 border">
                        <div className="flex items-center">
                          {item.image_url && (
                            <img
                              src={item.image_url}
                              alt={item.product_name}
                              className="w-10 h-10 object-cover mr-2"
                            />
                          )}
                          {item.product_name}
                        </div>
                      </td>
                      <td className="py-2 px-4 border">{item.quantity}</td>
                      <td className="py-2 px-4 border">
                        {item.price}
                        {' '}
                        ₸
                      </td>
                      <td className="py-2 px-4 border">
                        {(item.price * item.quantity).toFixed(2)}
                        {' '}
                        ₸
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Order Details</h2>
          {selectedOrder
            ? (
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="mb-4">
                    <h3 className="font-bold">
                      Order #
                      {selectedOrder.id}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {new Date(selectedOrder.created_at).toLocaleString()}
                    </p>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2">Items:</h4>
                    <ul className="space-y-2">
                      {selectedOrder.items?.map(item => (
                        <li key={item.id} className="flex justify-between">
                          <div className="flex items-center">
                            {item.image_url && (
                              <img
                                src={item.image_url}
                                alt={item.product_name}
                                className="w-8 h-8 object-cover mr-2"
                              />
                            )}
                            <span>
                              {item.product_name}
                              {' '}
                              ×
                              {item.quantity}
                            </span>
                          </div>
                          <span>
                            {(item.price * item.quantity).toFixed(2)}
                            {' '}
                            ₸
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between font-bold">
                      <span>Total:</span>
                      <span>
                        {selectedOrder.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                        {' '}
                        ₸
                      </span>
                    </div>
                  </div>
                </div>
              )
            : (
                <div className="bg-gray-100 p-4 rounded-lg text-center text-gray-500">
                  Select an order to view details
                </div>
              )}
        </div>
      </div>
    </div>
  );
}
