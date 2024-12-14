import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db, storage } from "../../../firebaseConfig";
import { getDownloadURL, ref } from "firebase/storage";

const TableThree: React.FC = () => {
  const [productData, setProductData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  // Fetch products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      const productsCollection = collection(db, "products");
      const productSnapshot = await getDocs(productsCollection);
      const products = await Promise.all(
        productSnapshot.docs.map(async (doc) => {
          const product = { id: doc.id, ...doc.data() };
          if (product.imageURL) {
            try {
              const imageRef = ref(storage, product.imageURL);
              const imageURL = await getDownloadURL(imageRef);
              product.imageURL = imageURL;
            } catch (error) {
              console.error("Error fetching image URL:", error);
              product.imageURL = "";
            }
          }
          return product;
        })
      );
      setProductData(products);
      setIsLoading(false);
    };

    fetchProducts();
  }, []);

  // Handle product deletion
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteDoc(doc(db, "products", id));
        setProductData((prev) => prev.filter((product) => product.id !== id));
        alert("Product deleted successfully!");
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product. Please try again.");
      }
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(productData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = productData.slice(indexOfFirstItem, indexOfLastItem);

  if (isLoading) {
    return <div>Loading products...</div>;
  }

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                Product Name
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Product Category
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
              Product Price
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
              Product Quantity
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((product) => (
              <tr key={product.id}>
                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                  <div className="flex items-center gap-4">
                    {product.imageURL && (
                      <img
                        src={product.imageURL}
                        alt={product.name}
                        className="h-12 w-12 rounded-md"
                      />
                    )}
                    <p className="text-sm font-medium text-black dark:text-white">
                      {product.name}
                    </p>
                  </div>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">{product.category}</p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">${product.price}</p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">{product.qty}</p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <div className="flex items-center space-x-3.5">
                    <button className="text-primary hover:text-primary-dark">
                      <Link to={`/editProduct/${product.id}`}>
                        <FaEdit />
                      </Link>
                    </button>
                    <button
                      className="text-primary hover:text-primary-dark"
                      onClick={() => handleDelete(product.id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4 mb-2">
        <button
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TableThree;
