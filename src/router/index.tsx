import React, { Suspense } from 'react';
import { Route, Routes } from "react-router-dom";
import PageLoding from '../components/PageLoding';
import MainLayout from "../Layout/MainLayout";
import DeputyLayout from "../Layout/DeputyLayout";
const Home = React.lazy(() => import('../view/Home'));
const Node = React.lazy(() => import('../view/Node'));

export default function Router() {
  return (
    <Suspense fallback={<PageLoding></PageLoding>}>
      <Routes>
        <Route path="/*" element={<MainLayout />}>
          <Route path=":address/">
            <Route index element={<Home />}></Route>
            <Route path="Node" element={<Node />}></Route>
          
            
          </Route>
          <Route path="" element={<Home />}></Route>
        </Route>
        <Route path="/DeputyLayout" element={<DeputyLayout />}>
        </Route>
      </Routes>
    </Suspense>
  )
}
