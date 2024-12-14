import { useEffect, useState } from 'react';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';

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
import CashierLayout from './layout/CashierLayout';
import AddProducts from './pages/Products/addProduct';
import Cashier from './pages/Cashier/Cashier';
import EditProduct from './pages/Products/editProduct';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './context/ProtectedRoute';

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

        <Route path="/" element={<Navigate to="/ECommerce" replace />} />

        {/* _________________________________________ */}
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
        {/* _________________________________________ */}

        {/* Parent route for admin */}
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
            path="profile"
            element={
              <>
                <PageTitle title="Profile" />
                <Profile />
              </>
            }
          />

          <Route
            path="products"
            element={
              <>
                <PageTitle title="Products" />
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
        </Route>

        {/* Parent route for user Cashier */}
        <Route path="/user" element={
          <ProtectedRoute>
            <CashierLayout />
          </ProtectedRoute>
        }>
          <Route
            path="Cashier"
            element={
              <>
                <PageTitle title="Cashier" />
                <Cashier />
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
            path="profile"
            element={
              <>
                <PageTitle title="Profile" />
                <Profile />
              </>
            }
          />


        </Route>




      </Routes>
    </AuthProvider>


  );
}

export default App;
