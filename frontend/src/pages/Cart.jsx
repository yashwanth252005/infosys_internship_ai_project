// frontend/src/pages/Cart.jsx
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Cart() {

    const navigate = useNavigate();
    const { user } = useAuth();

    const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();

    const total = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    if (cartItems.length === 0) {
        return (
            <div className="max-w-3xl mx-auto text-center mt-16">
                <h1 className="text-3xl font-bold mb-3">🛒 Your Cart is Empty</h1>
                <p className="text-gray-600 mb-6">
                    Add some goodies for your dog to get started.
                </p>
                <button
                    onClick={() => navigate("/shop")}
                    className="px-6 py-3 bg-primary text-white rounded-xl hover:opacity-90"
                >
                    Browse Products
                </button>
            </div>
        );
    }

    const handleCheckout = async () => {
        try {
            await api.post("/api/orders", {
                user_id: user.id,
                items: cartItems.map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                })),
                total,
            });

            alert("Order placed successfully! 🐶🛒");
            clearCart();
        } catch (err) {
            alert("Failed to place order. Please try again.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

            <div className="bg-white shadow rounded-lg p-6 space-y-6">
                {cartItems.map((item) => (
                    <div
                        key={item.id}
                        className="flex justify-between items-center bg-card shadow-card rounded-2xl p-4"
                    >
                        <div>
                            <h3 className="font-semibold">{item.name}</h3>
                            <p className="text-sm text-gray-600">
                                ₹{item.price} × {item.quantity}
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="font-bold">
                                ₹{item.price * item.quantity}
                            </span>

                            <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-red-600 hover:underline text-sm"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ))}


                <div className="mt-6 bg-gray-50 rounded-2xl p-6 shadow-card">
                    <h2 className="text-xl font-semibold mb-4">
                        Order Summary
                    </h2>

                    <p className="flex justify-between mb-2">
                        <span>Total Items</span>
                        <span>{cartItems.length}</span>
                    </p>

                    <p className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>₹{total}</span>
                    </p>

                    <button
                        onClick={handleCheckout}
                        className="mt-4 w-full py-3 bg-secondary text-white rounded-2xl hover:opacity-90"
                    >
                        Place Order
                    </button>
                </div>
            </div>
        </div>
    );
}