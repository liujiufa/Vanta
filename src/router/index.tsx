import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import PageLoding from "../components/PageLoding";
import MainLayout from "../Layout/MainLayout";
import DeputyLayout from "../Layout/DeputyLayout";
const Home = React.lazy(() => import("../view/Home"));
const Node = React.lazy(() => import("../view/Node"));
const ZeroStroke = React.lazy(() => import("../view/ZeroStroke"));
const Community = React.lazy(() => import("../view/Community"));
const SubscriptionNode = React.lazy(() => import("../view/SubscriptionNode"));
const SubscriptionCommunity = React.lazy(
  () => import("../view/SubscriptionCommunity")
);
const Invite = React.lazy(() => import("../view/Invite"));
const Exchange = React.lazy(() => import("../view/Exchange"));
const Insurance = React.lazy(() => import("../view/Insurance"));
const LotteryGame = React.lazy(() => import("../view/LotteryGame"));

export default function Router() {
  return (
    <Suspense fallback={<PageLoding></PageLoding>}>
      <Routes>
        <Route path="/*" element={<MainLayout />}>
          <Route path=":address/">
            <Route index element={<Home />}></Route>
            <Route path="Node" element={<Node />}></Route>
            <Route path="Community" element={<Community />}></Route>
            <Route
              path="SubscriptionNode"
              element={<SubscriptionNode />}
            ></Route>
            <Route
              path="SubscriptionCommunity"
              element={<SubscriptionCommunity />}
            ></Route>
            <Route path="Invite" element={<Invite />}></Route>
            <Route path="Exchange" element={<Exchange />}></Route>
            <Route path="Insurance" element={<Insurance />}></Route>
            <Route path="ZeroStroke" element={<ZeroStroke />}></Route>
            <Route path="LotteryGame" element={<LotteryGame />}></Route>
          </Route>
          <Route path="" element={<Home />}></Route>
        </Route>
        <Route path="/DeputyLayout" element={<DeputyLayout />}></Route>
      </Routes>
    </Suspense>
  );
}
