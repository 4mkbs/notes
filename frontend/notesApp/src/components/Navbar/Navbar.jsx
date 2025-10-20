import { useState } from "react";
import { useAuthentication, useGetNotes } from "../../libs";
import { useAuthStore } from "../../store";
import ProfileInfo from "../Cards/ProfileInfo";
import SearchBar from "../SearchBar/SearchBar";
import { FiBookOpen } from "react-icons/fi";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const userInfo = useAuthStore((state) => state.user);
  const { logout } = useAuthentication();
  useGetNotes(searchQuery);

  const handleSearch = () => {
    if (searchQuery) {
      //
    }
  };
  const onClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <nav className="glass sticky top-0 z-50 backdrop-blur-xl border-b border-white/20 shadow-soft">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center gap-4">
          {/* Left: Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
              <FiBookOpen className="text-white text-xl" />
            </div>
            <h2 className="text-2xl font-bold gradient-text">NotesApp</h2>
          </div>

          {/* Center: Search */}
          <div className="flex-1 flex justify-center">
            {userInfo ? (
              <SearchBar
                value={searchQuery}
                onChange={({ target }) => {
                  setSearchQuery(target.value);
                }}
                handleSearch={handleSearch}
                onClearSearch={onClearSearch}
              />
            ) : null}
          </div>

          {/* Right: Profile */}
          <div className="flex items-center gap-6">
            {userInfo ? (
              <ProfileInfo userInfo={userInfo} onLogout={logout} />
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
