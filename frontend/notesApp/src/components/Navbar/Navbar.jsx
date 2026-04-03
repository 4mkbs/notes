import { useAuthentication } from "../../libs";
import { useAuthStore, useNotesStore } from "../../store";
import { useThemeStore } from "../../store";
import ProfileInfo from "../Cards/ProfileInfo";
import SearchBar from "../SearchBar/SearchBar";
import { FiBookOpen, FiSun, FiMoon } from "react-icons/fi";

const Navbar = () => {
  const userInfo = useAuthStore((state) => state.user);
  const { logout } = useAuthentication();
  const searchQuery = useNotesStore((state) => state.searchQuery);
  const setSearchQuery = useNotesStore((state) => state.setSearchQuery);
  const { theme, toggleTheme } = useThemeStore();

  const onClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <nav className="glass sticky top-0 z-50 backdrop-blur-xl border-b border-slate-200 dark:border-gray-700 shadow-soft">
      <div className="container mx-auto px-3 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Left: Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
              <FiBookOpen className="text-white text-base sm:text-xl" />
            </div>
            <h2 className="text-lg sm:text-2xl font-bold gradient-text hidden sm:block">
              NotesApp
            </h2>
          </div>

          {/* Center: Search */}
          <div className="flex-1 flex justify-center">
            {userInfo ? (
              <SearchBar
                value={searchQuery}
                onChange={({ target }) => {
                  setSearchQuery(target.value);
                }}
                onClearSearch={onClearSearch}
              />
            ) : null}
          </div>

          {/* Right: Profile */}
          <div className="flex items-center gap-2 sm:gap-6">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-100 dark:bg-gray-800 hover:bg-slate-200 dark:hover:bg-gray-700 transition-colors duration-200"
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? (
                <FiSun className="text-yellow-400 text-lg sm:text-xl" />
              ) : (
                <FiMoon className="text-slate-700 text-lg sm:text-xl" />
              )}
            </button>

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
