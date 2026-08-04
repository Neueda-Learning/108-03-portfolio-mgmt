import { BrowserRouter, Route, Routes as RouterRoutes } from 'react-router-dom';
import React from 'react'

import Dashboard from '../pages/Dashboard';
import Holdings from '../pages/Holdings';
import Performance from '../pages/Performance';
import Settings from '../pages/Settings';
import Layout from '../common/Layout';


const AppRoutes = () => {
  return (
     <BrowserRouter>
       <RouterRoutes>
         <Route path="/" element={<Layout />}>
           <Route index element={<Dashboard />} />
           <Route path="holdings" element={<Holdings />} />
           <Route path="performance" element={<Performance />} />
           {/* <Route path="reports" element={<div className="rounded-xl border border-slate-200 bg-white p-6">Reports Page</div>} /> */}
           <Route path="settings" element={<Settings />} />
         </Route>
       </RouterRoutes>
     </BrowserRouter>
  )
}

export default AppRoutes
