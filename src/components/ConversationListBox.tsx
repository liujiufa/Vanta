// @ts-nocheck
import styled, { keyframes } from "styled-components";
import {
  Avatar,
  Chat,
  ConversationItem,
  ConversationList,
  GroupDetail,
  Header,
  Icon,
  Input,
  Modal,
  UserSelect,
  rootStore,
} from "easemob-chat-uikit";
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import { addMessage } from "../utils/tool";
import UserInfo from "./userInfo/userInfo";
import { FlexBox, FlexCCBox } from "./FlexBox";
import { ChatReturnIcon } from "../assets/image/homeBox";
import { addGroup, customer_service, getGroupList } from "../API";
import { stateType } from "../store/reducer";
import { useSelector } from "react-redux";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { observer } from "mobx-react-lite";

// import Search from "antd/lib/input/Search";

const ConversationBox = styled.div`
  .conversation-list-self {
    .cui-conversationItem-info {
      svg {
        width: 20px;
        height: 20px;
        font-size: 700;
        fill: #d56819;
      }
    }
  }
  .cui-user-select-footer {
    padding: 24px 5px;
    button {
      margin-right: 5px !important;
    }
  }
`;
const ChatBox = styled.div`
  width: 100%;
  .cui-chat {
    height: calc(100vh - 153px);
  }
  .Conversation_Self {
    .cui-header-iconBox {
      > div {
        display: none;
      }
    }
  }
  /* .cui-header-iconBox {
    > div {
      display: none;
    }
  } */
  /* height: 100%; */
`;
export const ReturnBox = styled(FlexBox)`
  padding: 12px;
  background: #f9fafa;
  border-bottom: 1px solid #e3e6e8;
  svg {
    width: 20px;
    height: 20px;
  }
`;

const Chat_container_chat_right = styled.div`
  height: calc(100vh - 153px);
  .user-info,
  .cui-groupSetting {
    height: calc(100vh - 153px);
  }
  .cui-userItem-info {
    svg {
      font-weight: 700;
      width: 20px;
      height: 20px;
      fill: #d56819;
    }
  }
  .GroupDetail_myself {
    .cui-userItem-info {
      display: none;
    }
  }
`;

const Btn = styled(FlexCCBox)<{ active: boolean }>`
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: #fff;
  margin-bottom: 9px;
  padding: 5px 12px;
  border-radius: 12px;
  background: ${({ active }) => (active ? "#d56819" : "rgb(117 130 138)")};
`;

const ConversationList_Auto = styled.div`
  background: #f9fafa;
`;
const ConversationList_Auto_Item = styled.div`
  height: calc(100vh - 153px);
`;

function ConversationListBox(props: any) {
  const { t, i18n } = useTranslation();
  const [addContactVisible, setAddContactVisible] = useState(false);
  const token = useSelector<stateType, stateType>((state: any) => state.token);
  const qbToken = useSelector<stateType, stateType>(
    (state: any) => state?.qbToken
  );
  const {
    address: web3ModalAccount,
    chainId,
    isConnected,
  } = useWeb3ModalAccount();
  // --- 创建会话 ---
  const [IsAddGroup, setIsAddGroup] = useState(false);
  const [userSelectVisible, setUserSelectVisible] = useState(false); // 是否显示创建群组弹窗
  const [conversationDetailVisible, setConversationDetailVisible] =
    useState(false); //是否显示群组设置/联系人详情弹窗
  const [cvsItem, setCvsItem] = useState<any>([]);
  const chatRef = useRef<any>(null);
  const [userId, setUserId] = useState(""); // 要添加联系人的userId
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);

  let [groupAvatar, setGroupAvatar] = useState("");
  let [Time, setTime] = useState(0);
  let [GroupList, setGroupList] = useState<any>([]);
  let [CustomerService, setCustomerService] = useState<any>([]);
  let [ActiveBox, setActiveBox] = useState(props?.index);
  const isInGroup = rootStore.addressStore.groups.some((item) => {
    // @ts-ignore
    return item.groupid == cvsItem.conversationId;
  });
  const handleEllipsisClick = (e: any) => {
    if (cvsItem.chatType == "groupChat") {
      isInGroup && setConversationDetailVisible((value) => !value);
      if (!!isInGroup) {
        return setActiveBox(2);
      } else {
        return addMessage("error");
      }
    } else {
      setConversationDetailVisible((value) => !value);
    }
    setActiveBox(2);
  };

  const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserId(e.target.value);
  };

  const getInitData = () => {
    if (!!token && !!web3ModalAccount) {
      getGroupList(web3ModalAccount + "").then((res: any) => {
        if (res?.code === 200) {
          console.log(res.data, "GroupList");

          setGroupList(res?.data || []);
        }
      });
    }
  };

  const topConversation = () => {
    rootStore.conversationStore.topConversation(cvsItem);
  };

  useEffect(() => {
    // 获取群组头像
    if (rootStore.loginState) {
      const groupIds =
        rootStore.addressStore.groups
          .filter((item) => !item.avatarUrl)
          .map((item) => {
            //@ts-ignore
            return item.groupid;
          }) || [];
      // getGroupAvatar(groupIds).then((res: any) => {
      //   for (let groupId in res) {
      //     rootStore.addressStore.updateGroupAvatar(groupId, res[groupId]);
      //   }
      // });
    }
  }, [rootStore.loginState, rootStore.addressStore.groups.length]);

  useEffect(() => {
    setConversationDetailVisible(false);
    setCvsItem(rootStore.conversationStore.currentCvs);
    if (rootStore.conversationStore.currentCvs.chatType === "groupChat") {
      let groupAvatarUrl = rootStore.addressStore.groups.find(
        (item: any) =>
          item.groupid === rootStore.conversationStore.currentCvs.conversationId
      )?.avatarUrl;
      setGroupAvatar(groupAvatarUrl || "");
    }
  }, [rootStore.conversationStore.currentCvs]);

  useEffect(() => {
    customer_service().then((res: any) => {
      if (res?.code === 200) {
        setCustomerService(res?.data || []);
      }
    });
  }, []);
  useEffect(() => {
    getInitData();
  }, [token]);

  return (
    <ConversationBox
      style={{ width: "100%", height: "100%" }}
      className="chat-container-conversation"
    >
      {Number(ActiveBox) === 0 &&
        (!IsAddGroup ? (
          <ConversationList
            renderHeader={() => (
              <Header
                moreAction={{
                  visible: true,
                  icon: (
                    <Icon
                      type="PLUS_IN_CIRCLE"
                      width={24}
                      height={24}
                      color={"#464E53"}
                    />
                  ),
                  actions: [
                    {
                      icon: (
                        <Icon
                          type="PERSON_ADD_FILL"
                          width={24}
                          height={24}
                          color={"#464E53"}
                        />
                      ),
                      content: t("addContact"),
                      onClick: () => {
                        setAddContactVisible(true);
                      },
                    },
                    {
                      icon: (
                        <Icon
                          type="PERSON_ADD"
                          width={24}
                          height={24}
                          color={"#464E53"}
                        />
                      ),
                      content: t("Add Group"),
                      onClick: () => {
                        setIsAddGroup(true);
                      },
                    },
                    {
                      icon: (
                        <Icon
                          type="PERSON_DOUBLE_FILL"
                          width={24}
                          height={24}
                          color={"#464E53"}
                        />
                      ),
                      content: t("createGroup"),
                      onClick: () => {
                        setUserSelectVisible(true);
                      },
                    },
                    {
                      icon: (
                        <Icon
                          type="GO_TO_CHAT"
                          width={24}
                          height={24}
                          color={"#464E53"}
                        />
                      ),
                      content: t("Contact Customer Service"),
                      onClick: () => {
                        console.log(CustomerService, "CustomerService");

                        rootStore.addressStore.addContact(
                          CustomerService[0]?.userId
                        );
                        rootStore.conversationStore.addConversation({
                          chatType: "singleChat",
                          conversationId: CustomerService[0]?.userId,
                          name: CustomerService[0]?.nickname,
                          lastMessage: {} as never,
                          unreadCount: 0,
                        });
                        rootStore.conversationStore.setCurrentCvs({
                          chatType: "singleChat",
                          name: CustomerService[0]?.nickname,
                          conversationId: CustomerService[0]?.userId,
                          unreadCount: 0,
                        });
                        setActiveBox(1);
                      },
                    },
                  ],
                  tooltipProps: {
                    placement: "bottomRight",
                  },
                }}
                content={t("Chats")}
                avatar={<></>}
              ></Header>
            )}
            // onItemClick={(item) => {
            //   setConversationDetailVisible(false);
            //   setCvsItem(item);
            //   setTime(new Date().valueOf());
            //   setActiveBox(1);
            // }}
            className="conversation-list conversation-list-self"
            renderItem={(cvs) => {
              console.log(
                cvs?.lastMessage,

                "cvs"
              );

              return (
                <ConversationItem
                  data={{
                    ...cvs,
                    lastMessage: {
                      ...cvs?.lastMessage,
                      from: cvs?.lastMessage?.from?.slice(2, 10),
                    },
                  }}
                  onClick={() => {
                    rootStore.conversationStore.addConversation(cvs);
                    rootStore.conversationStore.setCurrentCvs(cvs);
                    setConversationDetailVisible(false);
                    setCvsItem(cvs);
                    setActiveBox(1);
                  }}
                  moreAction={{
                    visible: true,
                    actions: [
                      {
                        // UIKit 默认提供会话删除事件。
                        content: "DELETE",
                      },
                      {
                        content: "Top Conversation",
                        onClick: topConversation,
                      },
                    ],
                  }}
                />
              );
            }}
          ></ConversationList>
        ) : (
          <ConversationList_Auto className="conversation-list">
            <ReturnBox style={{ marginBottom: "5px" }}>
              <ChatReturnIcon
                onClick={() => {
                  // getInitData();
                  setIsAddGroup(false);
                }}
                style={{
                  cursor: "pointer",
                  fontSize: 20,
                  verticalAlign: "middle",
                  marginRight: 10,
                  float: "left",
                  lineHeight: "50px",
                }}
              />
            </ReturnBox>
            {/* <Search></Search> */}
            <ConversationList_Auto_Item>
              {GroupList?.map((item: any, index: any) => (
                <div
                  className="cui-conversationItem cui-conversationItem-light"
                  key={index}
                >
                  <div
                    className="cui-avatar cui-avatar-circle cui-avatar-light"
                    style={{
                      width: "50px",
                      height: "50px",
                      lineHeight: "50px",
                      fontSize: "21px",
                    }}
                  >
                    <span className="cui-avatar-string">
                      {String(item?.name)?.length > 2
                        ? String(item?.name)?.slice(0, 2)
                        : item?.name}
                    </span>
                  </div>
                  <div className="cui-conversationItem-content">
                    <span className="cui-conversationItem-nickname ">
                      {item?.name}
                    </span>
                    <span className="cui-conversationItem-message">
                      {item?.affiliations_count}/{item?.maxusers}
                    </span>
                  </div>
                  <div className="cui-conversationItem-info">
                    {!item?.isJoin ? (
                      <Btn
                        active={true}
                        onClick={async () => {
                          if (!!token && !!item?.id) {
                            let res = await addGroup(item?.id);
                          }
                          rootStore.conversationStore.addConversation({
                            chatType: "groupChat",
                            conversationId: item?.id,
                            name: item?.name,
                            lastMessage: {} as never,
                            unreadCount: 0,
                          });
                          rootStore.conversationStore.setCurrentCvs({
                            chatType: "groupChat",
                            name: item?.name,
                            conversationId: item?.id,
                            unreadCount: 0,
                          });
                          // setConversationDetailVisible(false);
                          setActiveBox(1);
                        }}
                      >
                        {t("Join the group")}
                      </Btn>
                    ) : (
                      <Btn active={false}>{t("Joined the group")}</Btn>
                    )}
                  </div>
                </div>
              ))}
            </ConversationList_Auto_Item>
          </ConversationList_Auto>
        ))}

      <ChatBox>
        {Number(ActiveBox) === 1 && (
          <>
            <ReturnBox>
              <ChatReturnIcon
                onClick={() => {
                  setActiveBox(0);
                  getInitData();
                }}
                style={{
                  cursor: "pointer",
                  fontSize: 20,
                  verticalAlign: "middle",
                  marginRight: 10,
                  float: "left",
                  lineHeight: "50px",
                }}
              />
            </ReturnBox>
            <Chat
              key={Time}
              // MessageList 使用mome缓存了消息组件，修改这些控制显示开关时需要重新渲染组件
              // key={"false" + "false" + "false"}
              className="Conversation_Self"
              messageListProps={{
                renderUserProfile: () => {
                  return null;
                },
                messageProps: {
                  // 单条转发
                  reaction: false,
                  thread: false,
                  customAction: {
                    visible: true,
                    icon: null,
                    actions: [
                      {
                        content: "REPLY",
                        onClick: () => {},
                      },
                      {
                        content: "DELETE",
                        onClick: () => {},
                      },
                      {
                        content: "UNSEND",
                        onClick: () => {},
                      },

                      {
                        content: "Modify",
                        onClick: () => {},
                      },
                      {
                        content: "SELECT",
                        onClick: () => {},
                      },
                    ],
                  },
                },
              }}
              messageInputProps={{
                enabledTyping: true,
                onSendMessage: (msg) => {
                  // 发送消息回调，如果是合并转发的消息，显示转发弹窗
                  //   if (msg.type == "combine") {
                  //     setForwardedMessages(msg);
                  //     setContactListVisible(true);
                  //   }
                },
              }}
              headerProps={{
                moreAction: {
                  // 关闭默认行为，自定义更多操作
                  visible: true,
                  actions: [],
                },
                onClickEllipsis: handleEllipsisClick,
              }}
            ></Chat>
          </>
        )}

        {/** 是否显示群组设置 */}
        {Number(ActiveBox) === 2 && conversationDetailVisible && (
          <Chat_container_chat_right
            className="chat-container-chat-right"
            style={{ width: "100%" }}
          >
            <ReturnBox>
              <ChatReturnIcon
                onClick={() => {
                  setActiveBox(1);
                  setConversationDetailVisible(false);
                }}
                style={{
                  cursor: "pointer",
                  fontSize: 20,
                  verticalAlign: "middle",
                  marginRight: 10,
                  float: "left",
                  lineHeight: "50px",
                }}
              />
            </ReturnBox>
            {cvsItem.chatType == "groupChat" ? (
              <GroupDetail
                className="GroupDetailBox"
                // @ts-ignore
                width={430}
                conversation={{
                  chatType: "groupChat",
                  conversationId: cvsItem.conversationId,
                }}
                onLeaveGroup={() => {
                  setConversationDetailVisible(false);
                  setActiveBox(0);
                }}
                onDestroyGroup={() => {
                  setConversationDetailVisible(false);
                }}
                // @ts-ignore
                groupMemberProps={{
                  onPrivateChat: () => false,
                  // {
                  //   setConversationDetailVisible(false);
                  //   setActiveBox(1);
                  // }
                  onAddContact: () => false,
                  // {
                  //   return addMessage(t("Friend request sent"));
                  // }
                  className: "GroupDetail_myself",
                }}
                onUserIdCopied={() => {
                  return addMessage(t("copied"));
                }}
              ></GroupDetail>
            ) : (
              <UserInfo
                conversation={cvsItem}
                fun={() => {
                  setActiveBox(0);
                }}
              ></UserInfo>
            )}
          </Chat_container_chat_right>
        )}
      </ChatBox>

      <Modal
        width={430}
        open={addContactVisible}
        onCancel={() => {
          setAddContactVisible(false);
        }}
        onOk={() => {
          rootStore.addressStore.addContact(userId);
          setAddContactVisible(false);
        }}
        okText={t("add")}
        closable={false}
        title={t("addContact")}
      >
        <>
          <div className="add-contact">
            <Input
              placeholder={t("enterUserID")}
              className="add-contact-input"
              onChange={handleUserIdChange}
            ></Input>
          </div>
        </>
      </Modal>

      {/** 创建群组的联系人弹窗 */}
      <UserSelect
        className="UserSelect_Container"
        width={430}
        onCancel={() => {
          setUserSelectVisible(false);
        }}
        onOk={() => {
          rootStore.addressStore.createGroup(
            selectedUsers.map((user) => user.userId)
          );
          setUserSelectVisible(false);
        }}
        okText={t("create")}
        enableMultipleSelection
        onUserSelect={(user, users) => {
          setSelectedUsers(users);
        }}
        open={userSelectVisible}
      ></UserSelect>
    </ConversationBox>
  );
}

export default observer(ConversationListBox);
