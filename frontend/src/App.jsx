import React from 'react';
import Customers from './components/Customers/Customers';
import { Route, Routes } from 'react-router-dom';
import EditCustomer from './components/Customers/EditCustomer';
import Nav from './components/Nav';
import AddCustomer from './components/Customers/AddCustomer';
import Home from './components/Home';
import Order from '../src/components/Orders/Order';
import CountOrder from './components/Orders/CountOrder';

// import CreateOrder from './components/Orders/CreateOrder';


function App() {
  return <div>
    <Nav/>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/orders' element={<Order/>}/>
      <Route path='/orders/count' element={<CountOrder/>}/>
      <Route path='/customers' element={<Customers/>}/>
      <Route path='/customer/:id' element={<EditCustomer/>}/>
      <Route path='/add-customer' element={<AddCustomer/>}/>
    </Routes>
  </div>
}

export default App;
