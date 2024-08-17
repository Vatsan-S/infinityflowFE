import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Landingpage from '../Pages/Landingpage';
import Forgotpassword from '../Pages/Forgotpassword';
import Boxcollection from '../Pages/Boxcollection';
import Privateuserroute from '../Components/Privateuserroute';
import Privateroutecommon from '../Components/Privateroutecommon';
import Boxdetails from '../Pages/Boxdetails';

const App = () => {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Landingpage/>}/>
        <Route path='/forgotpassword' element={<Forgotpassword/>}/>
        <Route element={<Privateuserroute/>} allowedRoles={["Admin", "Manager"]}>
        <Route path='/box' element={<Boxcollection/>}/>
        </Route>
        <Route element={<Privateroutecommon/>}>
        <Route path='/box_details/:id' element={<Boxdetails/>}/>
        </Route>
      </Routes> 
      </BrowserRouter>
    </div>
  );
};

export default App;