import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';


import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Star } from 'lucide-react';
import { Input } from './ui/input';
import useReviews from '@/hooks/Restaurant/useReview';
import { useLocation } from 'react-router-dom';
export const ReviewDialog = ({ order, open, onClose, onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [title, setTitle] = useState('');
  console.log(order);

  const handleSubmit = () => {
    onSubmit({
      orderID: order.orderID,
      restaurantID: order.restaurantID,
      title,
      rating,
      comment
    });
    onClose();
  };
  const location = useLocation();
  const path = location.pathname.split('/');
  const userId = path[2];
  //console.log(order, "order");


  useEffect(() => {
    // console.log(reviewsData);
    
  }, []);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Review Order #{order?.orderID}</DialogTitle>
          <DialogDescription>
            Share your experience with this order
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <label className="block text-sm font-medium mb-1">Rating</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-8 w-8 ${rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-600">({rating} of 5)</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <Input placeholder="Title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            <label htmlFor="comment" className="block text-sm font-medium mb-1">
              Your Review
            </label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us about your experience..."
              className="resize-none"
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit Review</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};