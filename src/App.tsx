import './App.scss';
import './App.css';
import { useEffect } from 'react';
import './lang/i18n'
import { useWeb3React } from '@web3-react/core'
import { useSelector, useDispatch } from "react-redux";
import styled from 'styled-components';
import Routers from './router'
import { GetQueryString, showLoding, startWord } from './utils/tool'
// import web3 from 'web3';
import { stateType } from './store/reducer'
import { createAddMessageAction, createLoginSuccessAction, createDelMessageAction } from './store/actions'
import { Login } from './API'
import Loding from './components/loding'
import ViewportProvider from './components/viewportContext'
// import { useNavigate } from "react-router-dom";
// import Home from './view/Home';
import prohibit from './assets/image/prohibit.png'
import cloneIcon from './assets/image/cloneIcon.png'

import { t } from 'i18next';
import useConnectWallet from './hooks/useConnectWallet';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Web3 from 'web3';
import { useSign } from './hooks/useSign';
declare let window: any;

const MessageBox = styled.div`
  position:fixed;
  z-index: 9999;
  top: 90PX;
  right: 40px;
  @media screen and (max-width:967px) {
    right: 0 !important;
  }
`
function App() {
  let web3 = new Web3()
  console.log(Web3.modules, Web3.version, "Web3.modules");

  const web3React = useWeb3React()
  const { connectWallet } = useConnectWallet()
  const { signFun } = useSign()
  const navigate = useNavigate()
  const initalToken = localStorage.getItem((web3React.account as string)?.toLowerCase());

  useEffect(() => {
    connectWallet && connectWallet()
  }, [connectWallet])

  useEffect(() => {
    if (web3React.account) {
      let refereeUserAddress: any;
      let tag = web3.utils.isAddress(window.location.pathname.slice(1))
      if (tag) {
        refereeUserAddress = window.location.pathname.slice(1)
      } else {
        refereeUserAddress = null
      }
      // LoginFun(refereeUserAddress)
    } else {
      dispatch(createLoginSuccessAction(initalToken || '', web3React.account as string))
    }
  }, [web3React.account])
  const dispatch = useDispatch();
  let state = useSelector<stateType, stateType>(state => state);
  function addMessage(msg: string) {
    dispatch(createAddMessageAction({
      message: msg,
      index: state.message.length
    }))
  }


  const LoginFun = (str: string) => {
    if (web3React.account) {
      signFun((res: any) => {
        Login({
          ...res,
          // "userAddress": "0x79950F94200A6E134508840b51a19e477e08e97D",
          "userAddress": web3React.account as string,
          "refereeUserAddress": str,
        }).then((res: any) => {
          if (res.code === 200) {
            showLoding(false)
            localStorage.setItem((web3React.account as string).toLowerCase(), res.data.token)
            dispatch(createLoginSuccessAction(res.data.token, web3React.account as string))
          } else {
            showLoding(false)
            addMessage(res.msg)
          }
        })
      }, `userAddress=${web3React.account as string}&refereeUserAddress=${str}`)
    }
  }

  useEffect(() => {
    window?.ethereum?.on('accountsChanged', (accounts: string[]) => {
      // 账号改了，刷新网页
      // navigate("/")
      window.location.reload()
    })
    window?.ethereum?.on('networkChanged', (accounts: string[]) => {
      // 改了，刷新网页
      // navigate("/")
      window.location.reload()
    })
  }, [web3React.account])

  return (
    <ViewportProvider>
      <div className="App">
        <MessageBox>
          {
            state.message.map((item, index) =>
              <div className="messageItem" key={index}>
                <div className="messageLebel">
                  <img src={prohibit} alt="" />
                </div>
                <div className="messageConter">
                  <div className="title">{t('info')}</div>
                  <div className="content">
                    {item.message}
                  </div>
                  <img className="clone" onClick={() => { dispatch(createDelMessageAction(item.index)) }} src={cloneIcon} alt="" />
                </div>
              </div>
            )
          }
        </MessageBox>
        <Routers></Routers>
        {state.showLoding && <Loding></Loding>}
      </div>
    </ViewportProvider>
  );
}

export default App;
function setTipModal(msg: any) {
  throw new Error('Function not implemented.');
}

