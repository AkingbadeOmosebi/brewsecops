import { useState } from 'react';
import { ShoppingCart, Loader2, CheckCircle, Plus, Trash2, X } from 'lucide-react';
import { createOrder } from '@/services/orders';
import type { Product } from '@/services/products';

interface CartItem {
  product: Product;
  quantity: number;
}

interface OrderFormProps {
  products: Product[];
  onOrderCreated: () => void;
}

export const OrderForm = ({ products, onOrderCreated }: OrderFormProps) => {
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_password: '',
  });
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addToCart = () => {
    const product = products.find(p => p.id === selectedProduct);
    if (!product) return;

    const existingItem = cart.find(item => item.product.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCart([...cart, { product, quantity }]);
    }

    setSelectedProduct('');
    setQuantity(1);
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      setError('Please add items to your cart');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await createOrder({
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        customer_password: formData.customer_password,
        items: cart.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
        }))
      });

      if (!response.success) {
        throw new Error(response.error || 'Failed to create order');
      }

      setSuccess(true);
      setFormData({ customer_name: '', customer_email: '', customer_password: '' });
      setCart([]);

      setTimeout(() => {
        onOrderCreated();
        setSuccess(false);
      }, 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-2xl p-8 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-amber-500/20 p-3 rounded-xl relative">
          <ShoppingCart className="w-6 h-6 text-amber-400" />
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
              {cart.length}
            </span>
          )}
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white mb-1">Place an Order</h2>
          <p className="text-slate-400">Add multiple items</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Your Name *</label>
            <input
              type="text"
              required
              value={formData.customer_name}
              onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email *</label>
            <input
              type="email"
              required
              value={formData.customer_email}
              onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              placeholder="john@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Password *</label>
            <input
              type="password"
              required
              value={formData.customer_password}
              onChange={(e) => setFormData({ ...formData, customer_password: e.target.value })}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              placeholder="Create password"
            />
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-4">Add Items</h3>
          <div className="grid md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
              >
                <option value="">Choose...</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} - ${product.price}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <input
                type="number"
                min="1"
                max="10"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="w-20 bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-amber-500"
              />
              <button
                type="button"
                onClick={addToCart}
                disabled={!selectedProduct}
                className="flex-1 bg-amber-500/20 hover:bg-amber-500/30 disabled:bg-slate-700/20 border border-amber-500/30 text-amber-400 disabled:text-slate-600 font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
          </div>
        </div>

        {cart.length > 0 && (
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Cart</h3>
            <div className="space-y-3">
              {cart.map((item) => (
                <div key={item.product.id} className="flex items-center gap-4 bg-slate-900/50 rounded-lg p-3">
                  <div className="flex-1">
                    <p className="text-white font-medium">{item.product.name}</p>
                    <p className="text-sm text-slate-400">x{item.quantity} @ ${item.product.price}</p>
                  </div>
                  <span className="text-amber-400 font-bold">${(item.product.price * item.quantity).toFixed(2)}</span>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-red-400 hover:text-red-300 p-1"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-700 flex justify-between">
              <span className="text-lg font-semibold text-white">Total:</span>
              <span className="text-3xl font-bold text-amber-400">${cartTotal.toFixed(2)}</span>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start gap-3">
            <X className="w-5 h-5 text-red-400" />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <p className="text-emerald-400 text-sm">Order placed! Check Database State below.</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || success || cart.length === 0}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:from-slate-700 disabled:to-slate-700 text-white font-semibold py-4 px-6 rounded-lg flex items-center justify-center gap-2 text-lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              Placing...
            </>
          ) : success ? (
            <>
              <CheckCircle className="w-6 h-6" />
              Success!
            </>
          ) : (
            <>
              <ShoppingCart className="w-6 h-6" />
              Place Order ({cart.length})
            </>
          )}
        </button>
      </form>
    </div>
  );
};
