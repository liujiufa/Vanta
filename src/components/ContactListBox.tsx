import styled, { keyframes } from "styled-components";
import {
  ContactDetail,
  ContactList,
  ConversationList,
  Header,
  Icon,
  Input,
  Modal,
  rootStore,
} from "easemob-chat-uikit";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import toast from "./toast/toast";
import { addMessage } from "../utils/tool";
import { ReturnBox } from "./ConversationListBox";
import { ChatReturnIcon } from "../assets/image/homeBox";
import { observer } from "mobx-react-lite";

const ContactDetailBox = styled.div`
  .ContactDetail_Self {
    height: calc(100vh - 153px);
    .cui-contact-detail-content-btn-container {
      > button {
        display: none;
        &:first-child {
          display: flex;
        }
      }
    }
  }
`;

function ConversationListBox(props: any) {
  const { t, i18n } = useTranslation();
  const [addContactVisible, setAddContactVisible] = useState(false);

  const [contactData, setContactData] = useState({
    id: "",
    name: "",
    type: "contact",
  });
  const [userId, setUserId] = useState("");
  let [ActiveBox, setActiveBox] = useState(0);

  const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    setUserId(e.target.value);
  };
  return (
    <div style={{ width: "100%", height: "100%" }}>
      {Number(ActiveBox) === 0 && (
        <ContactList
          header={
            <Header
              avatar={<></>}
              content={t("contacts")}
              suffixIcon={
                <div title={t("addContact")} style={{ cursor: "pointer" }}>
                  <Icon
                    type="PERSON_ADD"
                    width={24}
                    height={24}
                    onClick={() => {
                      setAddContactVisible(true);
                    }}
                  ></Icon>
                </div>
              }
            ></Header>
          }
          // className="conversation"
          onItemClick={(data) => {
            let type = data.type;
            // if (data.type == "request") {
            //   type = "contact";
            // }
            console.log("点击联系人", data);
            setContactData({
              id: data.id,
              name: data.name,
              type: type,
            });
            setActiveBox(1);
          }}

          // onItemClick={(data) => {
          //   rootStore.conversationStore.addConversation({
          //     chatType: "singleChat",
          //     conversationId: data.id,
          //     lastMessage: {},
          //     unreadCount: "",
          //   });
          // }}
        />
      )}

      {Number(ActiveBox) === 1 && (
        <ContactDetailBox>
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
          <ContactDetail
            // @ts-ignore
            data={contactData}
            onMessageBtnClick={() => {
              // onMessageClick?.();
              props?.fun();
            }}
            onVideoCall={() => false}
            onAudioCall={() => false}
            onUserIdCopied={(userId) => {
              return addMessage(t("copySuccess"));
            }}
            className="ContactDetail_Self"
          ></ContactDetail>
        </ContactDetailBox>
      )}

      <Modal
        width={430}
        open={addContactVisible}
        onCancel={() => {
          setAddContactVisible(false);
        }}
        onOk={() => {
          rootStore.addressStore.addContact(userId);
          setAddContactVisible(false);
          return addMessage(t(""));
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
    </div>
  );
}

export default observer(ConversationListBox);
