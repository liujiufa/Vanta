import axois from "../utils/axiosExport";
interface LoginData {
  password: string;
  refereeUserAddress: string;
  userAddress: string;
  userPower: number;
}

export function Login(data: LoginData) {
  return axois.request({
    url: "/user/login",
    method: "post",
    data: {
      ...data,
    },
  });
}
/* 判断上级地址是否有效 */
export function isRefereeAddress(data: any) {
  return axois.request({
    url: `/user/isRefereeAddress`,
    method: "post",
    data: {
      ...data,
    },
  });
}

export function getUserInfo() {
  return axois.request({
    url: "/user/getUserInfo",
    method: "get",
  });
}

export function userInfo() {
  return axois.request({
    url: "/user/getUserInfo",
    method: "get",
  });
}

export function getRobotInfo() {
  return axois.request({
    url: "/robot/getRobotInfo",
    method: "get",
  });
}

export function receive(data: LoginData) {
  return axois.request({
    url: "/user/isRefereeAddress/{address}",
    method: "post",
    data: {
      ...data,
    },
  });
}

export function getRobotManageAward() {
  return axois.request({
    url: "/robot/getRobotManageAward",
    method: "get",
  });
}
export function getRobotPerformanceAwardInfo() {
  return axois.request({
    url: "/robot/getRobotPerformanceAwardInfo",
    method: "get",
  });
}

export function getRobotBuyRecord(status: any) {
  return axois.request({
    url: `/robot/getRobotBuyRecord/${status}`,
    method: "get",
  });
}
export function getRobotManageAwardRecord(type: any) {
  return axois.request({
    url: `/robot/getRobotManageAwardRecord/${type}`,
    method: "get",
  });
}
// 获取机器人业绩奖励记录
export function getRobotPerformanceAwardRecord(type: any) {
  return axois.request({
    url: `/robot/getRobotPerformanceAwardRecord/${type}`,
    method: "get",
  });
}
export function getRobotRankRecord(data: any) {
  return axois.request({
    url: "/rank/getRobotRankRecord",
    method: "post",
    data: {
      ...data,
    },
  });
}
export function getPledgeUserInfo() {
  return axois.request({
    url: `/pledge/getPledgeUserInfo`,
    method: "get",
  });
}
export function getRedemptionAccountInfo() {
  return axois.request({
    url: `/pledge/getRedemptionAccountInfo`,
    method: "get",
  });
}
export function getPledgeManageAward() {
  return axois.request({
    url: `/pledge/getPledgeManageAward`,
    method: "get",
  });
}
export function getPledgePerformanceAwardInfo() {
  return axois.request({
    url: `/pledge/getPledgePerformanceAwardInfo`,
    method: "get",
  });
}
export function getPledgeOrderRecord(status: number) {
  return axois.request({
    url: `/pledge/getPledgeOrderRecord/${status}`,
    method: "get",
  });
}
export function getMyCardInfo() {
  return axois.request({
    url: `/card/getMyCardInfo`,
    method: "get",
  });
}
export function joinPledge(data: any) {
  return axois.request({
    url: "/pledge/joinPledge",
    method: "post",
    data: {
      ...data,
    },
  });
}
export function buyNode(data: any) {
  return axois.request({
    url: "/node/buyNode",
    method: "post",
    data: {
      ...data,
    },
  });
}
export function activationNode(data: any) {
  return axois.request({
    url: "/node/activationNode",
    method: "post",
    data: {
      ...data,
    },
  });
}
export function activationCommunity(data: any) {
  return axois.request({
    url: "/community/activationCommunity",
    method: "post",
    data: {
      ...data,
    },
  });
}
export function joinGame(data: any) {
  return axois.request({
    url: "/game/joinGame",
    method: "post",
    data: {
      ...data,
    },
  });
}
export function getBannerList() {
  return axois.request({
    url: `/home/getBannerList`,
    method: "get",
  });
}
export function getNoticeList() {
  return axois.request({
    url: `/home/getNoticeList`,
    method: "get",
  });
}
export function getCoinPriceList() {
  return axois.request({
    url: `/home/getCoinPriceList`,
    method: "get",
  });
}
export function latestRecord(data: any) {
  return axois.request({
    url: `/pledge/latestRecord`,
    method: "post",
    data: {
      ...data,
    },
  });
}
export function getMyFreeInfo() {
  return axois.request({
    url: `/free/getMyFreeInfo`,
    method: "get",
  });
}
export function homePoolInfo() {
  return axois.request({
    url: `/game/homePoolInfo`,
    method: "get",
  });
}
export function getMyNodeInfo() {
  return axois.request({
    url: `/node/getMyNodeInfo`,
    method: "get",
  });
}
export function getPledgeUserAwardRecord(type: 9 | 10 | 50) {
  return axois.request({
    url: `/pledge/getPledgeUserAwardRecord/${type}`,
    method: "get",
  });
}
// 0:All 12-质押管理奖励 13-质押推荐奖励 14-质押平级奖励 15质押管理账户领取记录
export function getPledgeManageAwardRecord(type: 0 | 12 | 13 | 14 | 15) {
  return axois.request({
    url: `/pledge/getPledgeManageAwardRecord/${type}`,
    method: "get",
  });
}
// 16质押-业绩明星奖励 17质押-直推明星奖励 18质押-NFT团队明星奖励 19质押-业绩账户领取奖记录
export function getPledgePerformanceAwardRecord(type: 0 | 16 | 17 | 18 | 19) {
  return axois.request({
    url: `/pledge/getPledgePerformanceAwardRecord/${type}`,
    method: "get",
  });
}
export function getMyCommunity() {
  return axois.request({
    url: `/community/getMyCommunity`,
    method: "get",
  });
}
//0:all 46-节点LP加权  43-节点平均分配 44-节点小区加权 45-节点领取记录
export function getNodeAwardRecord(type: 0 | 46 | 43 | 44 | 45) {
  return axois.request({
    url: `/node/getNodeAwardRecord/${type}`,
    method: "get",
  });
}
export function getNodeBuyRecord() {
  return axois.request({
    url: `/node/getNodeBuyRecord`,
    method: "get",
  });
}
export function getNodeBaseInfo() {
  return axois.request({
    url: `/node/getNodeBaseInfo`,
    method: "get",
  });
}
//0-All 34-社区激活记录 35-社区LP加权奖励 36-社区平均分配奖励 37-社区小区加权奖励 38-社区账户奖励领取记录
export function getCommunityAwardRecord(type: 0 | 34 | 35 | 36 | 37 | 38) {
  return axois.request({
    url: `/community/getCommunityAwardRecord/${type}`,
    method: "get",
  });
}
export function getCommunitySoldBase() {
  return axois.request({
    url: `/community/getCommunitySoldBase`,
    method: "get",
  });
}
export function getCardBase() {
  return axois.request({
    url: `/card/getCardBase`,
    method: "get",
  });
}
export function getPioneerInfo() {
  return axois.request({
    url: `/card/getPioneerInfo`,
    method: "get",
  });
}
export function getLpUserInfo() {
  return axois.request({
    url: `/card/getLpUserInfo`,
    method: "get",
  });
}
// NFT分红记录，0:全部 20NFT-LP加权 21-NFT平均分配 22-NFT小区加权 23-NFT团队明星奖 24-NFT分红账户领取记录 25-NFT激活记录
export function getCardAwardRecord(type: any) {
  return axois.request({
    url: `/card/getCardAwardRecord/${type}`,
    method: "get",
  });
}
export function getCardBuyRecord() {
  return axois.request({
    url: `/card/getCardBuyRecord`,
    method: "get",
  });
}

// 40-LP赎回记录 28-NFT -LP分红记录 29NFT-LP奖励领取记录 30-提取已解锁   32-NFT在认购奖励记录领取
export function getLpUserAwardRecord(type: any) {
  return axois.request({
    url: `/card/getLpUserAwardRecord/${type}`,
    method: "get",
  });
}

export function redemptionLp(data: any) {
  return axois.request({
    url: `/card/redemptionLp`,
    method: "post",
    data: {
      ...data,
    },
  });
}
// 获取LP质押记录 0质押中 1待赎回 2已赎回
export function getLpUserPledgeRecord(type: -1 | 0 | 1 | 2) {
  return axois.request({
    url: `/card/getLpUserPledgeRecord/${type}`,
    method: "get",
  });
}
export function getExchangeRecord() {
  return axois.request({
    url: `/user/getExchangeRecord`,
    method: "get",
  });
}
export function getFirstRoundAccountInfo() {
  return axois.request({
    url: `/card/getFirstRoundAccountInfo`,
    method: "get",
  });
}
export function getSubscriptionAccountInfo() {
  return axois.request({
    url: `/card/getSubscriptionAccountInfo`,
    method: "get",
  });
}
// NFT先锋奖励记录
export function getCardPioneerRecord(type: 1 | 2) {
  return axois.request({
    url: `/card/getCardPioneerRecord/${type}`,
    method: "get",
  });
}

export function getTeamData() {
  return axois.request({
    url: `/user/getTeamData`,
    method: "get",
  });
}
export function getInsureStatus() {
  return axois.request({
    url: `/insure/status`,
    method: "get",
  });
}
export function getInsureResult() {
  return axois.request({
    url: `/insure/getInsureResult`,
    method: "get",
  });
}
export function getGameProfit() {
  return axois.request({
    url: `/game/profit`,
    method: "get",
  });
}
export function getGamePoolInfo() {
  return axois.request({
    url: `/game/poolInfo`,
    method: "get",
  });
}
export function hitRecord(data: any) {
  return axois.request({
    url: `/game/hitRecord`,
    method: "post",
    data: {
      ...data,
    },
  });
}
// 42-零撸动态直推记录
// //48-零撸账户奖励领取 41-零撸分享记录
export function getFreeAwardRecord(type: 0 | 48 | 42 | 41) {
  return axois.request({
    url: `/free/getFreeAwardRecord/${type}`,
    method: "get",
  });
}

// -1参与记录 0发放中奖所有记录 1-4对应等级
export function getGameRecord(type: -1 | 0 | 1 | 2 | 3 | 4) {
  return axois.request({
    url: `/game/getGameRecord/${type}`,
    method: "get",
  });
}

export function getGameDrawRecord() {
  return axois.request({
    url: `/game/getGameDrawRecord`,
    method: "get",
  });
}

export function drawAward(data: any) {
  return axois.request({
    url: `/user/drawAward`,
    method: "post",
    data: {
      ...data,
    },
  });
}
