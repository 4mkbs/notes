import { getInitials } from "../../utils/helper";
import { useAuthStore } from "../../store";

const ProfileInfo = ({ onLogout }) => {
  const userInfo = useAuthStore((state) => state.user);
  console.log(userInfo.user.fullName);

  return (
    <>
      {userInfo ? (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100 ">
            {getInitials(userInfo.user.fullName)}
          </div>

          <div className="ml-2">
            <p className="text-sm font-medium">{userInfo.user.fullName}</p>

            <button
              className="text-sm text-slate-700 underline"
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
