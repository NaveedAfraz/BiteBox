import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"

const useReviews = () => {

  const URL = "http://localhost:3006"

  const addreview = useMutation({
    mutationFn: async ({ restaurantId, title, rating, comment, userID, itemID, orderID }) => {
      console.log(restaurantId, title, rating, comment, userID, itemID)
      try {
        const res = await axios.post(`${URL}/api/reviews/addReview/${restaurantId}`, { title, rating, review: comment, userID, itemID, orderID })
        console.log(res);
        console.log("Review added successfully")
        return res.data
      } catch (error) {
        alert(error.response.data.message)
        console.error("Error adding review", error)
      }
    }
  })


  const deleteReview = useMutation({
    mutationFn: async (reviewId) => {
      try {
        const resposne = await axios.post(`${URL}/api/reviews/deleteReview/${userID}/${reviewId}`,
          {
            withCredentials: true,
          }
        )
        console.log(resposne);
        return resposne.data;
      } catch (error) {
        console.error("Error deleting review", error)
      }
    }
  })

  const fetchReviews = ({ restaurantId, userID, orderID }) => useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      console.log(restaurantId, userID,orderID, "data for review");

      try {
        const res = await axios.get(`${URL}/api/reviews/getReviews/${restaurantId}/${orderID}`)
        console.log(res);
        return res.data;
      } catch (error) {
        console.error("Error fetching reviews", error)
      }
    }
  })
  const queryClient = useQueryClient();

  const invalidateReviews = () => {
    queryClient.invalidateQueries(['reviews']);
  };

  return { addreview, deleteReview, fetchReviews, invalidateReviews }
}

export default useReviews