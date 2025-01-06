import { Rating } from '@mui/material'
import React from 'react'
import './ReviewCard.css'

const ReviewCard = ({review}) => {
    const options={
        value:review.rating,
        readOnly:true,
        precision:0.5
    }
  return (
    <div className='reviewCard'>
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9jZ2FzVxFkw-yBn7FM0dOJRzLD26gS5Ro1w&s" alt="Student" />
        <p>{review.name}</p>
        <Rating className='reviewCardRating' {...options}/>
        <span>{review.comment}</span>
    </div>
  )
}

export default ReviewCard