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
const Swap = React.lazy(() => import("../view/Swap"));
const Insurance = React.lazy(() => import("../view/Insurance"));
const LotteryGame = React.lazy(() => import("../view/LotteryGame"));
const FinancialRecord = React.lazy(() => import("../view/FinancialRecord"));
const SubscriptionQuotaRecord = React.lazy(
  () => import("../view/SubscriptionQuotaRecord")
);
const SubscriptionQuotaAwardRecord = React.lazy(
  () => import("../view/SubscriptionQuotaAwardRecord")
);
const RankRecord = React.lazy(() => import("../view/RankRecord"));
const Announcement = React.lazy(() => import("../view/Announcement"));
const Robot = React.lazy(() => import("../view/Robot"));
const Pledge = React.lazy(() => import("../view/Pledge"));
const PledgeAwardRecord = React.lazy(() => import("../view/PledgeAwardRecord"));
const NFT = React.lazy(() => import("../view/NFT"));
const SubscriptionNFT = React.lazy(() => import("../view/SubscriptionNFT"));
const PledgeEarningsRecord = React.lazy(
  () => import("../view/PledgeEarningsRecord")
);
const NFTAwardRecord = React.lazy(() => import("../view/NFTAwardRecord"));
const LPPledgeAwardRecord = React.lazy(
  () => import("../view/LPPledgeAwardRecord")
);
const InitialSubscriptionRewards = React.lazy(
  () => import("../view/InitialSubscriptionRewards")
);
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
            <Route path="Swap" element={<Swap />}></Route>
            <Route path="Exchange" element={<Exchange />}></Route>
            <Route path="Insurance" element={<Insurance />}></Route>
            <Route path="ZeroStroke" element={<ZeroStroke />}></Route>
            <Route path="LotteryGame" element={<LotteryGame />}></Route>
            <Route path="FinancialRecord" element={<FinancialRecord />}></Route>
            <Route
              path="SubscriptionQuotaRecord"
              element={<SubscriptionQuotaRecord />}
            ></Route>
            <Route
              path="SubscriptionQuotaAwardRecord"
              element={<SubscriptionQuotaAwardRecord />}
            ></Route>
            <Route path="RankRecord" element={<RankRecord />}></Route>
            <Route path="Announcement" element={<Announcement />}></Route>
            <Route path="Robot" element={<Robot />}></Route>
            <Route path="Pledge" element={<Pledge />}></Route>
            <Route
              path="PledgeAwardRecord"
              element={<PledgeAwardRecord />}
            ></Route>
            <Route
              path="PledgeEarningsRecord"
              element={<PledgeEarningsRecord />}
            ></Route>
            <Route path="NFT" element={<NFT />}></Route>
            <Route path="SubscriptionNFT" element={<SubscriptionNFT />}></Route>
            <Route path="NFTAwardRecord" element={<NFTAwardRecord />}></Route>
            <Route
              path="LPPledgeAwardRecord"
              element={<LPPledgeAwardRecord />}
            ></Route>
            <Route
              path="InitialSubscriptionRewards"
              element={<InitialSubscriptionRewards />}
            ></Route>
          </Route>
          <Route path="" element={<Home />}></Route>
        </Route>
        <Route path="/DeputyLayout" element={<DeputyLayout />}></Route>
      </Routes>
    </Suspense>
  );
}
