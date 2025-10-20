import { getInitials } from "../../utils/helper";
import { useAuthStore } from "../../store";

const ProfileInfo = ({ onLogout }) => {
  const userInfo = useAuthStore((state) => state.user);

  return (
    <>
      {userInfo?.user ? (
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-9 h-9 sm:w-12 sm:h-12 flex items-center justify-center rounded-full text-white text-xs sm:text-base font-medium bg-gradient-to-r from-primary to-secondary shadow-lg">
            {getInitials(userInfo.user.fullName)}
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-gray-800">
              {userInfo.user.fullName}
            </p>
            <button
              className="text-xs text-primary hover:text-secondary underline transition-colors duration-200"
              onClick={onLogout}
            >
              Logout
            </button>
          </div>

          {/* Mobile: Show only avatar, tap to logout */}
          <button
            className="sm:hidden text-xs text-primary hover:text-secondary font-medium"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      ) : null}
    </>
  );
};

export default ProfileInfo;
