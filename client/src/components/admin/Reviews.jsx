import React from 'react'
import CardComponent from './CardComponent'


function Reviews() {
  const reviews = [
    {
      id: 1,
      user: "Regular Customer",
      comment: "This restaurant is fantastic!",
      rating: 4.8,
      date: "2024-03-15"
    },
    {
      id: 2,
      user: "Food Critic",
      comment: "The ambiance is just perfect!",
      rating: 4.5,
      date: "2024-03-14"
    }
  ];
  return (
    <>

      <CardComponent item={reviews} title="reviews" /></>
  )
}

export default Reviews