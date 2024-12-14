import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { addDoc, collection } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '../../../firebaseConfig'; // Adjust paths based on your setup

// Define a type for the product form data
interface ProductFormData {
  name: string;
  category: string;
  price: number;
  qty: number;
  imageURL: string;
}

const AddProduct: React.FC = () => {
  // State to manage form data
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    category: '',
    price: 0,
    qty: 0,
    imageURL: '',
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Initialize navigate
  const navigate = useNavigate();

  // Handle input change
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'qty' ? parseFloat(value) : value,
    }));
  };

  // Handle file input change
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (file) {
      // Check if the file is an image
      if (!file.type.startsWith('image/')) {
        alert('Please upload a valid image file.');
        return;
      }

      uploadImage(file).then((url) => {
        console.log('Image URL to be saved:', url);  // Log URL
        setFormData((prev) => ({
          ...prev,
          imageURL: url,
        }));
      }).catch((error) => {
        console.error('Error uploading image:', error);  // Handle upload errors
        alert('Image upload failed. Please try again.');
      });
    }
  };

  // Upload image to Firebase Storage
  const uploadImage = async (file: File): Promise<string> => {
    const imageRef = ref(storage, `products/${file.name}`);
    try {
      await uploadBytes(imageRef, file);
      const downloadURL = await getDownloadURL(imageRef);
      console.log('Image uploaded successfully. URL:', downloadURL);  // Add this log
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image to Firebase:', error);
      throw new Error('Image upload failed. Please try again.');
    }
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate price and qty fields
    if (formData.price <= 0 || formData.qty <= 0) {
      alert('Price and quantity must be greater than zero.');
      return;
    }

    // Ensure that the imageURL is set before submitting
    if (!formData.imageURL) {
      
      return;
    }

    setIsLoading(true);

    console.log('Form data before submitting:', formData);  // Log form data

    try {
      // Add product data to Firestore
      const productData = {
        name: formData.name,
        category: formData.category,
        price: formData.price,
        qty: formData.qty,
        imageURL: formData.imageURL, // Ensure imageURL is included
      };

      await addDoc(collection(db, 'products'), productData);
      alert('Product added successfully!');

      // Reset form after successful submission
      setFormData({
        name: '',
        category: '',
        price: 0,
        qty: 0,
        imageURL: '',  // Clear imageURL after successful form submission
      });

      navigate('/tables'); // Redirect to table page
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb pageName="Add Product" />

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6.5">
        <h3 className="font-medium text-black dark:text-white mb-6">Add New Product</h3>

        <form className="flex flex-col gap-5.5" onSubmit={handleSubmit}>
          <div>
            <label className="mb-3 block text-black dark:text-white">Product Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter product name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full rounded-lg border-[1.5px] border-stroke py-3 px-5 outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
              required
            />
          </div>

          <div>
            <label className="mb-3 block text-black dark:text-white">Product Category</label>
            <input
              type="text"
              name="category"
              placeholder="Enter product category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full rounded-lg border-[1.5px] border-stroke py-3 px-5 outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
              required
            />
          </div>

          <div>
            <label className="mb-3 block text-black dark:text-white">Product Price</label>
            <input
              type="number"
              name="price"
              placeholder="Enter product price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full rounded-lg border-[1.5px] border-stroke py-3 px-5 outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
              required
            />
          </div>

          <div>
            <label className="mb-3 block text-black dark:text-white">Product Quantity</label>
            <input
              type="number"
              name="qty"
              placeholder="Enter product quantity"
              value={formData.qty}
              onChange={handleInputChange}
              className="w-full rounded-lg border-[1.5px] border-stroke py-3 px-5 outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
              required
            />
          </div>

          <div>
            <label className="mb-3 block text-black dark:text-white">Product Image</label>
            <input
              type="file"
              name="imageURL"
              onChange={handleFileChange}
              className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke py-3 px-5 outline-none dark:border-form-strokedark dark:bg-form-input dark:text-white"
            />
          </div>

          <button
            type="submit"
            className="mt-4 rounded-lg bg-primary py-3 px-6 text-white hover:bg-opacity-90"
            disabled={isLoading}
          >
            {isLoading ? 'Adding...' : 'Add Product'}
          </button>
        </form>
      </div>
    </>
  );
};

export default AddProduct;
