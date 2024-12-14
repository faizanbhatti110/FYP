import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../../../firebaseConfig';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface ProductFormData {
  name: string;
  category: string;
  price: number;
  qty: number;
  imageURL: File | null;
  existingImageURL?: string;
}

const EditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    category: '',
    price: 0,
    qty: 0,
    imageURL: null,
    existingImageURL: '',
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProductData = async () => {
      if (id) {
        try {
          const productRef = doc(db, 'products', id);
          const productSnap = await getDoc(productRef);

          if (productSnap.exists()) {
            const productData = productSnap.data();
            setFormData({
              name: productData.name,
              category: productData.category,
              price: productData.price,
              qty: productData.qty,
              imageURL: null,
              existingImageURL: productData.imageURL || '',
            });
            setLoading(false);
          } else {
            toast.error('Product not found.');
          }
        } catch (error) {
          toast.error('Error fetching product data.');
          console.error(error);
        }
      }
    };

    fetchProductData();
  }, [id]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'qty' ? parseFloat(value) : value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('Selected file:', file.name); // Debugging log
    }
    setFormData((prev) => ({
      ...prev,
      imageURL: file || null,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (id) {
      try {
        const productRef = doc(db, 'products', id);

        // Check if the image is being updated
        const imageURL = formData.imageURL
          ? await uploadImage(formData.imageURL)
          : formData.existingImageURL;

        console.log('Final imageURL:', imageURL); // Debugging log

        // Update the Firestore document
        await updateDoc(productRef, {
          name: formData.name,
          category: formData.category,
          price: formData.price,
          qty: formData.qty,
          imageURL: imageURL,
        });

        toast.success('Product updated successfully!');
        navigate('/products');
      } catch (error) {
        toast.error('Error updating product.');
        console.error(error);
      }
    }
  };



  // const uploadImage = async (file: File) => {
  //   try {
  //     console.log('Uploading file:', file.name); // Debugging log
  //     const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
  //     const storageRef = firebase.storage().ref(`products/${sanitizedFileName}`);
  //     const snapshot = await storageRef.put(file);
  //     const downloadURL = await snapshot.ref.getDownloadURL();
  //     console.log('Image uploaded successfully. URL:', downloadURL); // Debugging log
  //     return downloadURL;
  //   } catch (error) {
  //     console.error('Error uploading image:', error);
  //     toast.error('Image upload failed.');
  //     throw error;
  //   }
  // };

  const uploadImage = async (file: File): Promise<string> => {
    try {
      console.log('Uploading file:', file.name); // Debugging log
  
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
      const imageRef = ref(storage, `products/${sanitizedFileName}`);
      
      // Upload file to Firebase Storage
      await uploadBytes(imageRef, file);
      const downloadURL = await getDownloadURL(imageRef);
      
      console.log('Image uploaded successfully. URL:', downloadURL); // Debugging log
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image to Firebase:', error);
      throw new Error('Image upload failed. Please try again.');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <Breadcrumb pageName="Edit Product" />

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6.5">
        <h3 className="font-medium text-black dark:text-white mb-6">Edit Product</h3>

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
            {formData.existingImageURL && (
              <div className="mb-3">
                <img
                  src={formData.existingImageURL}
                  alt="Existing Product"
                  className="h-20 w-20 object-cover"
                />
              </div>
            )}
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
          >
            Update Product
          </button>
        </form>
      </div>
    </>
  );
};

export default EditProduct;
