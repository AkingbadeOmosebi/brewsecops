import { useState, useEffect } from 'react';
import { User, Loader2, Trash2, LogOut, Clock, Timer } from 'lucide-react';
import { getOrders } from '@/services/orders';
import { apiClient } from '@/services/api';
import type { Order } from '@/services/orders';

interface CustomerLoginProps {
  onOrderDeleted: () => void;
}

export const CustomerLogin = ({ onOrderDeleted }: CustomerLoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [sessionTime, setSessionTime] = useState(180); // 3 minutes = 180 seconds

  // Session timer countdown
  useEffect(() => {
    if (!isLoggedIn) return;

    const timer = setInterval(() => {
      setSessionTime((prev) => {
        if (prev <= 1) {
          handleLogout();
          alert('Session expired. Please login again.');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isLoggedIn]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeUntilReady = (readyAt: string) => {
    const now = new Date().getTime();
    const ready = new Date(readyAt).getTime();
    const diff = Math.max(0, ready - now);
    const minutes = Math.ceil(diff / 60000);
    return minutes;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await getOrders();
      if (response.success && response.data) {
        const userOrders = response.data.filter(
          order => 
            order.customer_email.toLowerCase() === email.toLowerCase() &&
            (order as any).customer_password === password
        );
        
        if (userOrders.length === 0) {
          throw new Error('Invalid email or password');
        }
        
        setMyOrders(userOrders);
        setIsLoggedIn(true);
        setSessionTime(180); // Reset timer
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setEmail('');
    setPassword('');
    setMyOrders([]);
    setSessionTime(180);
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
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">Customer Portal</h2>
            <p className="text-slate-400">Login to view and manage orders</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="max-w-md space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 disabled:from-slate-700 disabled:to-slate-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Logging in...
              </>
            ) : (
              <>
                <User className="w-5 h-5" />
                Login
              </>
            )}
          </button>

          <p className="text-xs text-slate-500 text-center mt-4">
            Test accounts: akingbadeo_ceo@brewcoffee.com / brew2026 or sarah.johnson@brewcoffee.com / coffee123
          </p>
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
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">My Orders</h2>
            <p className="text-slate-400">{email}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-4 py-2 rounded-lg">
            <Timer className="w-5 h-5 text-amber-400" />
            <span className={`font-mono font-semibold ${sessionTime < 60 ? 'text-red-400' : 'text-amber-400'}`}>
              {formatTime(sessionTime)}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors px-4 py-2"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>

      {myOrders.length === 0 ? (
        <div className="bg-slate-800/50 rounded-xl p-12 text-center">
          <p className="text-slate-400">No orders found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {myOrders.map((order) => {
            const minutesUntilReady = (order as any).ready_at ? getTimeUntilReady((order as any).ready_at) : 0;
            const isReady = minutesUntilReady === 0;
            
            return (
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
                      {order.status === 'pending' && (
                        <div className="flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 px-3 py-1 rounded-full">
                          <Clock className="w-4 h-4 text-blue-400" />
                          <span className="text-blue-300 text-xs font-semibold">
                            {isReady ? 'Ready for pickup!' : `Ready in ${minutesUntilReady} min`}
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-slate-400">
                      Placed: {new Date(order.created_at).toLocaleString()}
                    </p>
                    {(order as any).preparation_minutes && (
                      <p className="text-xs text-slate-500 mt-1">
                        Prep time: {(order as any).preparation_minutes} minutes
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-amber-400">${order.total}</p>
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
            );
          })}
        </div>
      )}

      <p className="text-xs text-slate-500 mt-6 text-center">
        Session expires in {formatTime(sessionTime)} • Demonstrates authentication, READ & DELETE operations
      </p>
    </div>
  );
};