import moment from "moment";
import { MdCreate, MdDelete, MdOutlinePushPin } from "react-icons/md";

const NoteCard = ({
  title,
  date,
  content,
  tags,
  isPinned,
  onEdit,
  onDelete,
  onPinNote,
}) => {
  return (
    <div className="group relative card p-6 bg-gradient-to-br from-white to-gray-50 border border-gray-100 overflow-hidden">
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl -z-0"></div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h6 className="text-lg font-bold text-gray-800 mb-1 line-clamp-2 group-hover:text-primary transition-colors duration-200">
              {title}
            </h6>
            <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {moment(date).format("MMM DD, YYYY")}
            </span>
          </div>
          <button
            onClick={onPinNote}
            className={`ml-2 p-2 rounded-lg transition-all duration-200 ${
              isPinned
                ? "bg-primary text-white shadow-lg scale-110"
                : "bg-gray-100 text-gray-400 hover:bg-gray-200"
            }`}
          >
            <MdOutlinePushPin className="text-xl" />
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">
          {content}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 3).map((item, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
              >
                #{item}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                +{tags.length - 3}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors duration-200"
            >
              <MdCreate className="text-lg" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors duration-200"
            >
              <MdDelete className="text-lg" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
