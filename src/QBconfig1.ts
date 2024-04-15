export const QBConfig = {
  credentials: {
    // appId: 103174,
    // accountKey: "ack_-ack_DTLiyKehjzJecpYyAGXd",
    // authKey: "ak_vRpxG4kpbRgN237",
    // authSecret: "as_XYYNLKcZ2jzJsvb",
    // sessionToken: "",
    // appId: 103068,
    // accountKey: "ack_-ack_fWSNHVxTshsJcXYB4pjZ",
    // authKey: "ak_dzz83qUkYdAUhXg",
    // authSecret: "as_PNOw2gLdtavZggB",
    // sessionToken: "",
    appId: 103001,
    accountKey: "ack_-cVBvAtxKCGeKW9tygy3",
    authKey: "ak_L3Swpr7QfYKAkjp",
    authSecret: "as_ZJEdLrZhHwwfT2Y",
    sessionToken: "",
  },
  appConfig: {
    chatProtocol: {
      Active: 2,
    },
    debug: false,
    endpoints: {
      apiEndpoint: "https://api.quickblox.com",
      chatEndpoint: "chat.quickblox.com",
    },
    on: {
      async sessionExpired(handleResponse: any, retry: any) {
        console.log(`Test sessionExpired… ${handleResponse} ${retry}`);
      },
    },
    streamManagement: {
      Enable: true,
    },
  },
};
