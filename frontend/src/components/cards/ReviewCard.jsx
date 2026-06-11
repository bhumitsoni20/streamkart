import Avatar from '../ui/Avatar';
import Rating from '../ui/Rating';

const ReviewCard = ({ review }) => {
  return (
    <div className="bg-gray-900/60 border border-white/5 rounded-xl p-4">
      <div className="flex items-center gap-3 mb-3">
        <Avatar src={review.user?.avatar} name={review.user?.name} size="sm" />
        <div>
          <p className="text-white text-sm font-medium">{review.user?.name}</p>
          <Rating value={review.rating} size="sm" showValue={false} />
        </div>
        <span className="ml-auto text-xs text-gray-500">
          {new Date(review.createdAt).toLocaleDateString()}
        </span>
      </div>
      {review.comment && <p className="text-gray-400 text-sm">{review.comment}</p>}
    </div>
  );
};

export default ReviewCard;
