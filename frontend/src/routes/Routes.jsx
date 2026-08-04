import { BrowserRouter, Route, Routes as RouterRoutes } from 'react-router-dom';
import React from 'react'
import Layout from '../common/Layout';

import Dashboard from '../pages/Dashboard';
import Holdings from '../pages/Holdings';
import Performance from '../pages/Performance';
import Settings from '../pages/Settings';

const AppRoutes = () => {
  return (
     <BrowserRouter>
       <RouterRoutes>
        <Route element={<Layout/>}></Route>
         <Route path="/" element={<Dashboard />} />
         <Route path="/holdings" element={<Holdings />} />
         <Route path="/performance" element={<Performance />} />
         <Route path="/settings" element={<Settings />} />
       </RouterRoutes>
     </BrowserRouter>
  )
}

export default AppRoutes
