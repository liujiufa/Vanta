import { useEffect, useRef, useState } from "react";
import dayjs from 'dayjs'
const noop = () => { };

const useTime = ({ initDiffTime }:any) => {
    console.log(initDiffTime, "initEndTime");

    const [status, setStatus] = useState(false)
    // 当前时间
    // const [currentTime, setCurrentTime] = useState(dayjs().unix());

    // 终止时间
    // const [endTime, setEndTime] = useState(initEndTime);

    // 时间差 /倒计时时间
    const [diffTime, setDiffTime] = useState(initDiffTime);
    const tickRef = useRef(noop);
    // console.log(diffTime, "nioh");

    const tick = () => {
        if (!isNaN(diffTime)) {
            // console.log(diffTime, "nioh");
            if (Number(diffTime) > 0) {
                setDiffTime(diffTime - 1);
            } else if (Number(diffTime) === 0) {
                // console.log("nioh1212");

                setStatus(true)
            }
        }
    };

    useEffect(() => {
        tickRef.current = tick;
    });

    useEffect(() => {
        const timerId = setInterval(() => tickRef.current(), 1000);
        console.log("timerId", timerId);

        return () => clearInterval(timerId);
    }, []);

    return [diffTime, status, initDiffTime,setDiffTime];
};

export default useTime;