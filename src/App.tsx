import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import Calendar from './pages/Calendar';
import Chart from './pages/Chart';
import Index from './pages/Registration';
import SignUp from './pages/Registration/SignUp';
import ECommerce from './pages/Dashboard/ECommerce';
import FormElements from './pages/Form/FormElements';
import FormLayout from './pages/Form/FormLayout';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Tables from './pages/Tables';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';
import DefaultLayout from './layout/DefaultLayout';
import AddProducts from './pages/Products/addProduct';
import EditProduct from './pages/Products/editProduct';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './context/ProtectedRoute';

// Mock functions for fetching and updating product data
// const fetchProduct = async (id: string) => {
// Return some mock data for the product with the given ID
//   return {
//     name: 'Product A',
//     category: 'Category A',
//     price: 100,
//     quantity: 10,
//     image: null,
//     existingImage: 'path/to/existing/image.jpg',
//   };
// };

// const updateProduct = async (id: string, data: any) => {
//   console.log('Product updated:', id, data);
// };

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (

    <AuthProvider>
      <Routes>


        _________________________________________
        <Route
          path="/signin"
          element={
            <>
              <PageTitle title="Signin" />
              <SignIn />
            </>
          }
        />


        <Route
          path="/signup"
          element={
            <>
              <PageTitle title="SignUp" />
              <SignUp />
            </>
          }
        />
        _________________________________________




        {/* Parent route for DefaultLayout */}
        <Route path="/" element={
          <ProtectedRoute>
            <DefaultLayout />
          </ProtectedRoute>
        }>


          {/* Child routes */}
          <Route
            path="ECommerce"
            element={
              <>
                <PageTitle title="Dashboard" />
                <ECommerce />
              </>
            }
          />



          {/* Update the EditProduct route to handle productId dynamically */}

          <Route
            path="calendar"
            element={
              <>
                <PageTitle title="Calendar" />
                <Calendar />
              </>
            }
          />
          <Route
            path="profile"
            element={
              <>
                <PageTitle title="Profile" />
                <Profile />
              </>
            }
          />
          <Route
            path="forms/form-elements"
            element={
              <>
                <PageTitle title="Form Elements" />
                <FormElements />
              </>
            }
          />
          <Route
            path="forms/form-layout"
            element={
              <>
                <PageTitle title="Form Layout" />
                <FormLayout />
              </>
            }
          />
          <Route
            path="tables"
            element={
              <>
                <PageTitle title="Tables" />
                <Tables />
              </>
            }
          />
          <Route
            path="addproduct"
            element={
              <>
                <PageTitle title="Add Product" />
                <AddProducts />
              </>
            }
          />
          <Route
            path="editproduct/:id"
            element={
              <>
                <PageTitle title="Edit Product" />
                <EditProduct />
              </>
            }
          />
          <Route
            path="settings"
            element={
              <>
                <PageTitle title="Settings" />
                <Settings />
              </>
            }
          />
          <Route
            path="chart"
            element={
              <>
                <PageTitle title="Basic Chart" />
                <Chart />
              </>
            }
          />
          <Route
            path="ui/alerts"
            element={
              <>
                <PageTitle title="Alerts" />
                <Alerts />
              </>
            }
          />
          <Route
            path="ui/buttons"
            element={
              <>
                <PageTitle title="Buttons" />
                <Buttons />
              </>
            }
          />
        </Route>
      </Routes>
    </AuthProvider>


  );
}

export default App;
