import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Order {
  marketplace: string;
  storeName: string;
  orderId: string;
  orderValue: number;
  items: number;
  destination: string;
  daysOverdue: number;
}

const OrderTable: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ordersPerPage: number = 10;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get<Order[]>('/api/merged-orders');
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  const handleSort = () => {
    const sortedOrders = [...orders].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.daysOverdue - b.daysOverdue;
      } else {
        return b.daysOverdue - a.daysOverdue;
      }
    });
    setOrders(sortedOrders);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(orders.length / ordersPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="analytics-dashboard">
      <div className="table-container">
        <h2>Overdue Orders</h2>
        <table>
          <thead>
            <tr>
              <th>MARKETPLACE</th>
              <th>STORE</th>
              <th>ORDER ID</th>
              <th>ORDER VALUE</th>
              <th>ITEMS</th>
              <th>DESTINATION</th>
              <th onClick={handleSort} style={{ cursor: 'pointer' }}>
                DAYS OVERDUE {sortOrder === 'asc' ? '↑' : '↓'}
              </th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order, index) => (
              <tr key={index}>
                <td>{order.marketplace}</td>
                <td>{order.storeName}</td>
                <td>{order.orderId}</td>
                <td>${order.orderValue}</td>
                <td>{order.items}</td>
                <td>{order.destination}</td>
                <td className={order.daysOverdue > 0 ? 'overdue' : ''}>{order.daysOverdue}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          <button onClick={handlePreviousPage} disabled={currentPage === 1}>
            Previous
          </button>
          <span>
            Page {currentPage} of {Math.ceil(orders.length / ordersPerPage)}
          </span>
          <button onClick={handleNextPage} disabled={currentPage === Math.ceil(orders.length / ordersPerPage)}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderTable;
