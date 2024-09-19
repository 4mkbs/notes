import React, { useState } from "react";
import { useAuthentication, useGetNotes } from "../../libs";
import { useAuthStore } from "../../store";
import ProfileInfo from "../Cards/ProfileInfo";
import SearchBar from "../SearchBar/SearchBar";

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
    handleClearSearch();
  };

  return (
    <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow">
      <h2 className="text-xl font-medium text-black py-2">Notes</h2>

      {userInfo ? (
        <>
          <SearchBar
            value={searchQuery}
            onChange={({ target }) => {
              setSearchQuery(target.value);
            }}
            handleSearch={handleSearch}
            onClearSearch={onClearSearch}
          />
          <ProfileInfo userInfo={userInfo} onLogout={logout} />
        </>
      ) : null}
    </div>
  );
};

export default Navbar;
