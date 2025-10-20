import { getInitials } from "../../utils/helper";
import { useAuthStore } from "../../store";

const ProfileInfo = ({ onLogout }) => {
  const userInfo = useAuthStore((state) => state.user);

  return (
    <>
      {userInfo?.user ? (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 flex items-center justify-center rounded-full text-white font-medium bg-gradient-to-r from-primary to-secondary shadow-lg">
            {getInitials(userInfo.user.fullName)}
          </div>

          <div>
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
        </div>
      ) : null}
    </>
  );
};

export default ProfileInfo;
