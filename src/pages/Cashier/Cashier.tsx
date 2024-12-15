import React, { useState, useEffect } from 'react';
import { collection, doc, getDoc, getDocs, query, where, addDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode';

const Cashier = () => {
    // Add audio state
    const [audio] = useState(new Audio('/beep.mp3'));

    const playBeep = async () => {
        try {
            audio.currentTime = 0; // Reset audio to start
            await audio.play();
        } catch (error) {
            console.error("Error playing beep:", error);
        }
    };

    const [cartId, setCartId] = useState('');
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [showScanner, setShowScanner] = useState(false);

    useEffect(() => {
        if (cartId) {
            playBeep(); // Play beep sound
            handleSearch();
        }
    }, [cartId]);

    useEffect(() => {
        if (showScanner) {
            const scanner = new Html5QrcodeScanner("reader", {
                qrbox: {
                    width: 250,
                    height: 250,
                },
                fps: 5,
                rememberLastUsedCamera: true,
                aspectRatio: 1,
                formatsToSupport: [ Html5QrcodeSupportedFormats.QR_CODE ]
            });

            const onScanSuccess = (decodedText) => {
                try {
                    const scannedData = JSON.parse(decodedText);
                    if (scannedData && scannedData.id) {
                        setCartId(scannedData.id);
                        scanner.clear();
                        setShowScanner(false);
                    }
                } catch (error) {
                    console.error("QR code parsing error:", error);
                }
            };

            const onScanError = (error) => {
                // Ignore scan errors as they occur frequently during scanning
                console.debug("QR scan error:", error);
            };

            scanner.render(onScanSuccess, onScanError);

            return () => {
                scanner.clear().catch(console.error);
            };
        }
    }, [showScanner]);

    const handleSearch = async () => {
        try {
            setLoading(true);
            setCartItems([]); // Clear existing items first

            // Get cart document
            const cartRef = doc(db, 'carts', cartId);
            const cartSnap = await getDoc(cartRef);

            if (!cartSnap.exists()) {
                alert('Cart not found!');
                setCartId(''); // Clear input
                return;
            }

            // Get cart data
            const cartData = cartSnap.data();

            // Fetch product details for each cart item
            const itemsWithDetails = await Promise.all(
                cartData.cart.map(async (item) => {
                    const productRef = doc(db, 'products', item.id);
                    const productSnap = await getDoc(productRef);
                    const productData = productSnap.data();

                    return {
                        ...item,
                        ...productData,
                        totalPrice: item.quantity * productData.price
                    };
                })
            );

            setCartItems(itemsWithDetails);
        } catch (error) {
            console.error('Error fetching cart:', error);
            alert('Error: Invalid cart ID');
            setCartItems([]); // Clear table on error
            setCartId(''); // Clear input
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitOrder = async () => {
        try {
            setSubmitLoading(true);

            // Get cart document to access userId
            const cartRef = doc(db, 'carts', cartId);
            const cartSnap = await getDoc(cartRef);
            const cartData = cartSnap.data();

            // Check for existing order
            const orderQuery = query(
                collection(db, 'customer_orders'),
                where('cartId', '==', cartId),
                where('userId', '==', cartData.userId)
            );
            const orderSnap = await getDocs(orderQuery);

            if (!orderSnap.empty) {
                alert('This order has already been processed!');
                setCartItems([]);
                setCartId('');
                return;
            }

            // Create order document
            await addDoc(collection(db, 'customer-orders'), {
                userId: cartData.userId,
                cartId: cartId,
                orderDate: new Date(),
                totalAmount: calculateTotal()
            });

            alert('Order submitted successfully!');
            setCartItems([]);
            setCartId('');
        } catch (error) {
            console.error('Error submitting order:', error);
            alert('Error submitting order');
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleReset = () => {
        setCartItems([]);
        setCartId('');
    };

    const calculateTotal = () => {
        return cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Cashier</h1>

            <div className="flex gap-4 mb-6">
                <input
                    type="text"
                    value={cartId}
                    onChange={(e) => setCartId(e.target.value)}
                    placeholder="Enter Cart ID"
                    className="border p-2 rounded"
                />
                <button 
                    onClick={() => setShowScanner(!showScanner)}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                >
                    {showScanner ? 'Close Scanner' : 'Scan QR'}
                </button>
                <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    {loading ? 'Searching...' : 'Search'}
                </button>
                <button
                    onClick={handleReset}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                >
                    Reset
                </button>
            </div>

            {showScanner && (
                <div id="reader" className="w-96 mx-auto mb-6"></div>
            )}

            {cartItems.length > 0 && (
                <>
                    <table className="w-full border-collapse border">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border p-2">Product Name</th>
                                <th className="border p-2">Category</th>
                                <th className="border p-2">Quantity</th>
                                <th className="border p-2">Price</th>
                                <th className="border p-2">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map((item) => (
                                <tr key={item.id}>
                                    <td className="border p-2">{item.name}</td>
                                    <td className="border p-2">{item.category}</td>
                                    <td className="border p-2">{item.quantity}</td>
                                    <td className="border p-2">${item.price}</td>
                                    <td className="border p-2">${item.totalPrice}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="bg-gray-100">
                                <td colSpan={4} className="border p-2 font-bold">Total</td>
                                <td className="border p-2 font-bold">${calculateTotal()}</td>
                            </tr>
                        </tfoot>
                    </table>
                    <button
                        onClick={handleSubmitOrder}
                        disabled={submitLoading}
                        className="mt-4 bg-green-500 text-white px-6 py-2 rounded"
                    >
                        {submitLoading ? 'Submitting...' : 'Submit Order'}
                    </button>
                </>
            )}
        </div>
    );
};

export default Cashier;