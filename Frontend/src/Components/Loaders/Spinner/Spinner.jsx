import React from 'react'
import {TailSpin} from 'react-loader-spinner'

function Spinner() {
    return (
        <TailSpin
            visible={true}
            height="20"
            width="20"
            color="white"
            ariaLabel="tail-spin-loading"
            radius="1"
            wrapperStyle={{}}
            wrapperClass=""
        />
    )
}

export default Spinner