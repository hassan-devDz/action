import React from 'react'
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress"
function LoadingPage() {
    return (
        <Backdrop open>
        <CircularProgress color="inherit" />
      </Backdrop>
    )
}

export default LoadingPage
