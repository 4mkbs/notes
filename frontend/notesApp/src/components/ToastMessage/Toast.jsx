import { useEffect } from "react";
import { LuCheck } from "react-icons/lu";
import { MdDeleteOutline } from "react-icons/md";
const Toast = ({ isShown, message, type, onClose }) => {
  useEffect(() => {
    const timeOutId = setTimeout(() => {
      onClose();
    }, 2000);

    return () => {
      clearTimeout(timeOutId);
    };
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-2 right-2 z-[9999] transition-all duration-500 transform ${
        isShown
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <div
        className={`min-w-80 bg-white border shadow-2xl rounded-xl overflow-hidden after:w-[5px] after:h-full ${
          type === "delete" ? "after:bg-red-500" : "after:bg-green-500"
        } after:absolute after:left-0 after:top-0 after:rounded-l-xl`}
      >
        <div className="flex items-center gap-3 py-4 px-5">
          <div
            className={`w-10 h-10 flex items-center justify-center rounded-full ${
              type === "delete" ? "bg-red-50" : "bg-green-50"
            }`}
          >
            {type === "delete" ? (
              <MdDeleteOutline className="text-xl text-red-500" />
            ) : (
              <LuCheck className="text-xl text-green-500" />
            )}
          </div>

          <p className="text-sm text-slate-800 font-medium">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default Toast;
