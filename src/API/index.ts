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
