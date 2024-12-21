import { VenetianMask, Share2, Heart, Flag } from 'lucide-react';

const ConfessionCard = ({ confession }: any) => {
  const formattedDate = new Date(confession.createdAt).toLocaleString();

  return (
    <div className="bg-orange-50 rounded-lg p-4 h-full">
      <div className="flex items-center gap-2 mb-2">
        <VenetianMask className="w-8 h-8 text-black mb-1" />
        <div>
          <div className="font-medium">{confession.title}</div>
          <div className="text-xs text-gray-500">{formattedDate}</div>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-gray-700">{confession.content}</p>
      </div>

      <div className="flex items-center gap-4">
        <button className="hover:text-orange-400">
          <Heart className='h-5 w-5' />
        </button>

        <button className="hover:text-orange-400">
          <Share2 className='h-5 w-5' />
        </button>

        <button className="hover:text-red-500 ml-auto">
          <Flag className='h-5 w-5' />
        </button>
      </div>
    </div>
  );
};

export default ConfessionCard;