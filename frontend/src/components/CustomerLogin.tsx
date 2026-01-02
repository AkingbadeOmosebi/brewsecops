import { useState } from 'react';
import { User, Loader2, Trash2, LogOut } from 'lucide-react';
import { getOrders } from '@/services/orders';
import { apiClient } from '@/services/api';
import type { Order } from '@/services/orders';

interface CustomerLoginProps {
  onOrderDeleted: () => void;
}

export const CustomerLogin = ({ onOrderDeleted }: CustomerLoginProps) => {
  const [email, setEmail] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await getOrders();
      if (response.success && response.data) {
        const userOrders = response.data.filter(
          order => order.customer_email.toLowerCase() === email.toLowerCase()
        );
        setMyOrders(userOrders);
        setIsLoggedIn(true);
      }
    } catch (err) {
      setError('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setEmail('');
    setMyOrders([]);
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;

    try {
      const response = await apiClient.post(`/orders/${orderId}/delete`, {});
      
      if (response.success) {
        setMyOrders(myOrders.filter(order => order.id !== orderId));
        onOrderDeleted();
      } else {
        alert('Failed to cancel order');
      }
    } catch (err) {
      alert('Failed to cancel order');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 rounded-2xl p-8 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-indigo-500/20 p-3 rounded-xl">
            <User className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white mb-1">Customer Login</h2>
            <p className="text-slate-400">View and manage your orders</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="max-w-md">
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Enter your email address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              placeholder="your@email.com"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm mb-4">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 disabled:from-slate-700 disabled:to-slate-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <User className="w-5 h-5" />
                View My Orders
              </>
            )}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 rounded-2xl p-8 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-500/20 p-3 rounded-xl">
            <User className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white mb-1">My Orders</h2>
            <p className="text-slate-400">{email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>

      {myOrders.length === 0 ? (
        <div className="bg-slate-800/50 rounded-xl p-12 text-center">
          <p className="text-slate-400">No orders found for this email address</p>
        </div>
      ) : (
        <div className="space-y-4">
          {myOrders.map((order) => (
            <div
              key={order.id}
              className="bg-slate-800/50 border border-slate-700 rounded-xl p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-lg font-bold text-white">
                      Order #{order.id.substring(0, 8)}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      order.status === 'pending' 
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400">
                    Placed on {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-amber-400">${order.total}</p>
                </div>
              </div>

              {order.items && order.items.length > 0 && (
                <div className="mb-4 space-y-2">
                  {order.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-slate-300">
                        {item.product_name} x{item.quantity}
                      </span>
                      <span className="text-slate-400">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}

              {order.status === 'pending' && (
                <button
                  onClick={() => handleDeleteOrder(order.id)}
                  className="w-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 hover:text-red-300 font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Cancel Order
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-slate-500 mt-6 text-center">
        Demonstrates READ and DELETE operations
      </p>
    </div>
  );
};
