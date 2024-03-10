import axois from '../utils/axiosExport'
interface LoginData {
    password: string;
    refereeUserAddress: string;
    userAddress: string;
    userPower: number;
}

export function Login(data: LoginData) {
    return axois.request({
        url: '/user/loginByPass',
        method: 'post',
        data: {
            ...data,
        }
    })
}
/* 获取LP挖矿显示数据 */
export function getHomePrice() {
    return axois.request({
        url: '/ippUserOrder/getHomePrice',
        method: 'get'
    })
}
// 绑定关系
export function signBindReferee(data: any) {
    console.log(data);

    return axois.request({
        url: `/uUser/signBindReferee`,
        method: 'post',
        data: {
            ...data,
        }
    })
}
export function incomeRecordList(data: any) {
    return axois.request({
        url: `/userProperty/incomeRecordList`,
        method: 'post',
        data: {
            ...data,
        }
    })
}
export function lpRecordList(data: any) {
    return axois.request({
        url: `/userProperty/lpRecordList`,
        method: 'post',
        data: {
            ...data,
        }
    })
}
export function refereeUserList(data: any) {
    return axois.request({
        url: `/userRefereeBinary/refereeUserList`,
        method: 'post',
        data: {
            ...data,
        }
    })
}
export function teamUserList(data: any) {
    return axois.request({
        url: `/userRefereeBinary/teamUserList`,
        method: 'post',
        data: {
            ...data,
        }
    })
}
// 获取用户信息
export function userInfo(data: any) {
    return axois.request({
        url: `/user/userInfo`,
        method: 'post',
        data: {
            ...data,
        }
    })
}
// 获取用户LP信息
export function userLpInfo(data: any) {
    return axois.request({
        url: `/user/userLpInfo`,
        method: 'post',
        data: {
            ...data,
        }
    })
}
// 获取用户LP信息
export function receive(data: any) {
    return axois.request({
        url: `/userProperty/receive`,
        method: 'post',
        data: {
            ...data,
        }
    })
}
// 获取用户LP信息
export function userIsBind(data: any) {
    return axois.request({
        url: `/user/userIsBind`,
        method: 'post',
        data: {
            ...data,
        }
    })
}
