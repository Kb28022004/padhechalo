import React from 'react'
import {  NavLink } from 'react-router-dom'
import { useCartContext } from '../../../context/cartContext'
import './CartItemsCard.css'

const CartItemsCard = ({item}) => {

 const {removeItemFromCart}=useCartContext()
  return (
    <div className='cartItemCard'>
        <img src={item.image} alt={item.name} />
        <div>
            <NavLink to={`/course/${item.course}`} >{item.name}</NavLink>
            <span>{`CourseFess : ₹${item.courseFees}`}</span>
            <p onClick={()=>removeItemFromCart(item.course)} >Remove</p>
        </div>
    </div>
  )
}

export default CartItemsCard