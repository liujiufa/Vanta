import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import lodash from 'lodash';

function subscribeCallBack(data: any, subscribes: any) {
    if (data) {
        let topic = data.headers.destination;
        let funces = subscribes.get(topic);
        funces.forEach((func: any) => {
            func(data);
        });
    }
}
interface ClientManagerObj {
    client: any,
    connecting: boolean,
    subscribes: any,
    subscribe: (topic: any, onMessage: any) => void,
    subscribesAll: any,
    disconnect: any,
    connect: any,
    errorCallBack: any

}

let clientManager: ClientManagerObj = {
    client: null,
    connecting: false,//是否正在连接
    subscribes: new Map(),//订阅列表
    subscribe(topic: any, onMessage: any) {
        if (this.client != null && this.client.connected == true) {
            //已连接状态
            console.log('增加订阅 已连接状态');
            if (!this.subscribes.has(topic)) {
                this.client.subscribe(topic, (data: any) => subscribeCallBack(data, this.subscribes));
                this.subscribes.set(topic, [onMessage]);
            } else {
                let funces = this.subscribes.get(topic);
                funces.push(onMessage);
            }
        } else {
            //未连接状态
            console.log('增加订阅 未连接状态');
            if (!this.subscribes.has(topic)) {
                this.subscribes.set(topic, [onMessage]);
            } else {
                let funces = this.subscribes.get(topic);
                funces.push(onMessage);
            }
        }
    },
    subscribesAll() {
        console.log('订阅全部');
        if (lodash.isEmpty(this.client) || this.client.connected != true) {
            return;
        }
        let subscribes = this.subscribes;
        for (let topic of subscribes.keys()) {
            this.client.subscribe(topic, (data: any) => subscribeCallBack(data, subscribes));
        }
    },
    disconnect() {
        console.log('断开连接');
        if (lodash.isEmpty(this.client) || this.client.connected != true) {
            return;
        }
        this.client.disconnect();
        this.subscribes = new Map();
    },
    connect(onSuccess: any, onDisconnect: any) {
        try {
            if (this.connecting == true) {
                console.log('正在连接中');
                return;
            }
            this.connecting = true;
            if (lodash.isEmpty(this.client) || this.client.connected != true) {//未连接状态
                let socket = new SockJS('/bond/notification', null, { timeout: 6000 });
                let stompClient = Stomp.over(socket);
                // stompClient.debug;
                console.log('开始连接');
                stompClient.connect
                    ({},
                        () => {
                            this.client = stompClient;
                            console.log('连接成功');
                            this.subscribesAll();//连接成功后开始订阅所有内容
                            if (onSuccess != null && onSuccess != undefined) {
                                onSuccess();
                            };
                        },
                        (error) => this.errorCallBack(error, onSuccess, onDisconnect)
                    );
            } else if (this.client != null && this.client.connected == true) {//已连接状态直接调用回调
                onSuccess();
            }
        }
        catch (err) {
            console.log('连接异常', err);
        }
        finally {
            this.connecting = false;
        }
    },
    errorCallBack(error: any, onSuccess: any, onDisconnect: any) {
        console.log('连接失败');
        if (onDisconnect != null && onDisconnect != undefined) {
            onDisconnect();
        }
        setTimeout(() => {//自动重连
            console.log('重新连接中');
            this.connect(onSuccess, onDisconnect);
        }, 10000);
    },
};

export default clientManager;