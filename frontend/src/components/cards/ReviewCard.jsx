import Avatar from '../ui/Avatar';
import Rating from '../ui/Rating';

const ReviewCard = ({ review }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <Avatar src={review.user?.avatar} name={review.user?.name} size="sm" />
          <div>
            <p className="text-gray-900 text-sm font-semibold">{review.user?.name}</p>
            <p className="text-gray-400 text-xs">{review.user?.title || 'Verified Buyer'}</p>
          </div>
        </div>
        <span className="text-gray-400 text-xs">
          {new Date(review.createdAt).toLocaleDateString()}
        </span>
      </div>
      <Rating value={review.rating} size="sm" showValue={false} />
      {review.comment && <p className="text-gray-600 text-sm mt-3 leading-relaxed">"{review.comment}"</p>}
    </div>
  );
};

export default ReviewCard;
