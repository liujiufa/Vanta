export const QBConfig = {
  credentials: {
    appId: "YOUR_APP_ID_FROM_ADMIN_PANEL",
    accountKey: "YOUR_ACCOUNT_KEY_FROM_ADMIN_PANEL",
    authKey: "YOUR_AUTH_KEY_FROM_ADMIN_PANEL",
    authSecret: "YOUR_AUTH_SECRET_FROM_ADMIN_PANEL",
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
