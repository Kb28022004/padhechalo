import React from 'react'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import './SuccessPayment.css'
import { Typography } from '@mui/material'
import { Link } from 'react-router-dom'

const SuccessPayment = () => {
  return (
    <>
    <div className="orderSuccess">
        <CheckCircleIcon/>
        <Typography>Your Order has been placed successfully</Typography>
        <Link to='/orders'>View Orders</Link>
    </div>
    </>
  )
}

export default SuccessPayment