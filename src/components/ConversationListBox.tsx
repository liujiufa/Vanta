import styled, { keyframes } from "styled-components";
import {
  Chat,
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

const ConversationBox = styled.div`
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

const ConversationItemBox = styled.div``;

export default function ConversationListBox(props: any) {
  const { t, i18n } = useTranslation();
  const [addContactVisible, setAddContactVisible] = useState(false);

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
  let [ActiveBox, setActiveBox] = useState(props?.index);
  const thread = rootStore.threadStore;
  const isInGroup = rootStore.addressStore.groups.some((item) => {
    // @ts-ignore
    return item.groupid == cvsItem.conversationId;
  });
  const handleEllipsisClick = () => {
    if (cvsItem.chatType == "groupChat") {
      if (thread.showThreadPanel) {
        rootStore.threadStore.setThreadVisible(false);
      }
      isInGroup && setConversationDetailVisible((value) => !value);
    } else {
      setConversationDetailVisible((value) => !value);
    }
    setActiveBox(2);
  };

  const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserId(e.target.value);
  };
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

  return (
    <ConversationBox style={{ width: "100%", height: "100%" }}>
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
                      content: t("Add group"),
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
                        rootStore.conversationStore.addConversation({
                          chatType: "singleChat",
                          conversationId: "d451c95cb9",
                          name: "kkkkkk",
                          lastMessage: {} as never,
                          unreadCount: 0,
                        });
                        rootStore.conversationStore.setCurrentCvs({
                          chatType: "singleChat",
                          name: "kkkkkk",
                          conversationId: "d451c95cb9",
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
            onItemClick={(item) => {
              setConversationDetailVisible(false);
              setCvsItem(item);
              setActiveBox(1);
            }}
            className="conversation-list"
            // renderItem={(cvs: any, index: any) => {
            //   console.log(cvs, "cvs");

            //   return (
            //     <div className="cui-conversationItem cui-conversationItem-light">
            //       <div
            //         className="cui-avatar cui-avatar-circle cui-avatar-light"
            //         style={{
            //           width: "50px",
            //           height: "50px",
            //           lineHeight: "50px",
            //           fontSize: "21px",
            //         }}
            //       >
            //         <span className="cui-avatar-string">四海</span>
            //       </div>
            //       <div className="cui-conversationItem-content">
            //         <span className="cui-conversationItem-nickname ">
            //           四海之内皆兄弟
            //         </span>
            //         <span className="cui-conversationItem-message">
            //           74faac750a: ggg
            //         </span>
            //       </div>
            //       <div className="cui-conversationItem-info">
            //         <span className="cui-conversationItem-time">Sun</span>
            //         <div style={{ height: "20px", position: "relative" }}>
            //           <span className="cui-badge cui-badge-not-a-wrapper"></span>
            //         </div>
            //       </div>
            //     </div>
            //   );
            // }}
          ></ConversationList>
        ) : (
          <ConversationList
            renderHeader={() => (
              <ReturnBox style={{ marginBottom: "5px" }}>
                <ChatReturnIcon
                  onClick={() => {
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
            )}
            // onItemClick={(item) => {
            //   setConversationDetailVisible(false);
            //   setCvsItem(item);
            //   setActiveBox(1);
            // }}
            className="conversation-list"
            renderItem={(cvs: any, index: any) => {
              console.log(cvs, "cvs");

              return (
                <div className="cui-conversationItem cui-conversationItem-light">
                  <div
                    className="cui-avatar cui-avatar-circle cui-avatar-light"
                    style={{
                      width: "50px",
                      height: "50px",
                      lineHeight: "50px",
                      fontSize: "21px",
                    }}
                  >
                    <span className="cui-avatar-string">四海</span>
                  </div>
                  <div className="cui-conversationItem-content">
                    <span className="cui-conversationItem-nickname ">
                      四海之内皆兄弟
                    </span>
                    <span className="cui-conversationItem-message">
                      2000/2000
                    </span>
                  </div>
                  <div className="cui-conversationItem-info">
                    {true ? (
                      <Btn active={true}>{t("Join the group")}</Btn>
                    ) : (
                      <Btn active={false}>{t("Joined the group")}</Btn>
                    )}
                  </div>
                </div>
              );
            }}
          ></ConversationList>
        ))}

      <ChatBox>
        {Number(ActiveBox) === 1 && (
          <>
            <ReturnBox>
              <ChatReturnIcon
                onClick={() => {
                  setActiveBox(0);
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
              // MessageList 使用mome缓存了消息组件，修改这些控制显示开关时需要重新渲染组件
              key={"false" + "false" + "false"}
              ref={chatRef}
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
              <UserInfo conversation={cvsItem}></UserInfo>
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
