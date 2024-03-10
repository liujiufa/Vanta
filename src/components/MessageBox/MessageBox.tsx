import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './MessageBox.scss'
export default function MessageBox({ preNoticeList }: any) {
    const navigate = useNavigate()
    const [animate, setAnimate] = useState(false)
    const [NoticeList, setNoticeList] = useState<any>(preNoticeList)
    const intervalRef = useRef<any>()
    const [timer, setTimer] = useState(0)

    // 公告向上轮播
    const changeAnim = () => {
        if (NoticeList) {
            setTimeout(() => {
                NoticeList.push(NoticeList[0]);
                NoticeList.shift();
                setNoticeList(NoticeList)
                setAnimate(false)
            }, 1500)
        }
    }


    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setAnimate(true)
            changeAnim()
            setTimer(timer + 1)
        }, 1500)
        return () => {
            clearInterval(intervalRef.current)
        }
    }, [timer])
    return (
        <div className='NoticeBox'>
            {NoticeList?.length > 0 && <>
                {/* <MassageBox messageData={NoticeList}>
            </MassageBox> */}

                <div className="bannerBox" onClick={(event) => {
                    event.stopPropagation()
                    event.preventDefault()
                }}>
                    <div className="content">
                        {NoticeList?.map((item: any, index: any) => <div className={animate ? 'anim box' : 'box'} key={index}>
                            <div className={index === 1 ? "active subBannerTitle" : "subBannerTitle"} onClick={() => { navigate("/Notice") }}>{item?.noticeTitle}</div>
                            {/* {(index === 1 && <div className="view" onClick={() => { navigate("/Notice") }}>{t("195")}</div>)} */}
                        </div>
                        )}
                    </div>
                </div >
            </>}
        </div>
    )
}
