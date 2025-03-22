import React from 'react'
import CardComponent from './CardComponent'
import useReviews from '@/hooks/Restaurant/useReview';


function Reviews() {
  const { fetchReviews } = useReviews();
  const { data: reviewsData, refetch } = fetchReviews({ restaurantId: null, userID: null, orderID: null });
  const [reviewsDataState, setreviewsData] = React.useState([]);
  React.useEffect(() => {

    // reviewsData.data.icon = null
    if (reviewsData?.data) {
      setreviewsData(reviewsData?.data);
    }
  }, [reviewsData?.data]);
  console.log(reviewsDataState);

  return (
    <>
      {reviewsDataState.length > 0 && <CardComponent item={reviewsDataState} title="reviews" />}
    </>
  )
}

export default Reviews