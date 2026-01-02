import { useState, useEffect } from 'react';
import { Coffee, ShoppingBag, Database, Code, Server, Container, Check, AlertCircle, ExternalLink } from 'lucide-react';
import { getProducts } from '@/services/products';
import { getOrders } from '@/services/orders';
import { OrderForm } from '@/components/OrderForm';
import { CustomerLogin } from '@/components/CustomerLogin';
import type { Product } from '@/services/products';
import type { Order } from '@/services/orders';

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const productsResponse = await getProducts();
      if (productsResponse.success && productsResponse.data) {
        setProducts(productsResponse.data);
      }

      const ordersResponse = await getOrders();
      if (ordersResponse.success && ordersResponse.data) {
        setOrders(ordersResponse.data);
      }

      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
      setLoading(false);
    }
  };

  const handleOrderCreated = () => {
    // Refresh orders to show new order
    fetchData();
  };

  const handleImageError = (productId: string) => {
    setImageErrors(prev => new Set(prev).add(productId));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mx-auto mb-6"></div>
            <Coffee className="w-8 h-8 text-amber-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-xl text-slate-300 font-light">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 border border-red-500/30 rounded-2xl shadow-2xl p-8 max-w-md">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
            <h1 className="text-2xl font-bold text-red-500">Connection Error</h1>
          </div>
          <p className="text-slate-300 mb-4">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      
      {/* Header */}
      <header className="relative bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500 shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        
        <div className="container mx-auto px-6 py-16 relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
              <Coffee className="w-16 h-16 text-white" />
            </div>
            <div>
              <h1 className="text-6xl font-bold text-white mb-2 tracking-tight">Aking's Coffee</h1>
              <p className="text-2xl text-amber-50 font-light">Brew Beautifully, Deploy Securely</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-amber-50/90">
            <Code className="w-4 h-4" />
            <span className="text-sm font-medium">DevSecOps Platform Demo</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        
        {/* Status */}
        <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-2xl p-6 mb-12 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
                <Check className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full animate-pulse"></div>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-emerald-300 mb-1">System Online</h2>
              <p className="text-slate-400 text-sm">Backend API + PostgreSQL Connected</p>
            </div>
            <div className="hidden md:flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-300">API</span>
              </div>
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-300">PostgreSQL</span>
              </div>
            </div>
          </div>
        </div>

        {/* Menu */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-4xl font-bold text-white mb-2">Coffee Menu</h2>
              <p className="text-slate-400">{products.length} beverages</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.slice(0, 9).map((product) => (
              <div 
                key={product.id} 
                className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden hover:border-amber-500/50 hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-56 bg-slate-900 overflow-hidden">
                  {!imageErrors.has(product.id) ? (
                    <img 
                      src={product.image_url} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={() => handleImageError(product.id)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-900/20 to-orange-900/20">
                      <Coffee className="w-16 h-16 text-amber-500/30" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <span className="bg-slate-900/80 backdrop-blur-sm text-amber-400 text-xs font-semibold px-3 py-1.5 rounded-full border border-amber-500/30">
                      {product.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-white group-hover:text-amber-400 transition-colors">
                      {product.name}
                    </h3>
                    <span className="text-2xl font-bold text-amber-400">${product.price}</span>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Order Form - CRUD Demo */}
        <section className="mb-16">
          <OrderForm products={products} onOrderCreated={handleOrderCreated} />
        </section>

        {/* Customer Login - View/Delete Orders */}
        <section className="mb-16">
          <CustomerLogin onOrderDeleted={handleOrderCreated} />
        </section>

        {/* Orders */}
        <section className="mb-16">
          <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/30 rounded-2xl p-8 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-500/20 p-3 rounded-xl">
                <Database className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-1">Database State</h2>
                <p className="text-slate-400">PostgreSQL persistence</p>
              </div>
            </div>

            <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-xl font-semibold text-blue-300 mb-4">Recent Orders ({orders.length})</h3>
              
              {orders.length === 0 ? (
                <p className="text-slate-400 text-center py-8">No orders yet</p>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <div 
                      key={order.id} 
                      className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-white">{order.customer_name}</p>
                          <p className="text-sm text-slate-400">{order.customer_email}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-emerald-400">${order.total}</p>
                          <span className="text-xs text-amber-300">{order.status}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-12">
        <div className="container mx-auto px-6 text-center">
          <p className="text-xl font-bold text-white mb-2">Aking's Coffee</p>
          <p className="text-slate-400">DevSecOps Platform</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
