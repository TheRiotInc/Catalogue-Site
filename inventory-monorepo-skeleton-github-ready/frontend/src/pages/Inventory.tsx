import React, { useEffect, useState } from 'react';

export default function Inventory() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:4000/api/inventory/list', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Inventory</h1>
      <table className="table-auto border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border px-4 py-2">Product</th>
            <th className="border px-4 py-2">SKU</th>
            <th className="border px-4 py-2">Stock</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={idx}>
              <td className="border px-4 py-2">{item.product?.name}</td>
              <td className="border px-4 py-2">{item.product?.sku}</td>
              <td className="border px-4 py-2">{item.qty}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
