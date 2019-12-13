import React, { useEffect, useState } from 'react'
import rawScripts from '../scripts/index'
import actions from '../components/Game/actions'
interface IProps {

}
export default function gallery(props: IProps) {
    console.log(rawScripts.cgs)
    useEffect(() => {
        getUnlockData()
    }, [])
    const getUnlockData = async () => {
        const res = await actions.getCgUnlockData() || []
        setUnlockKeys(res)
        console.log(res)
    }
    const [unLockKeys, setUnlockKeys]: [any[], any] = useState([])
    return <div>
    </div>
}