import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";

const SearchBar = ({ value, onChange, handleSearch, onClearSearch }) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    } else if (e.target.value === "" && e.key === "Backspace") {
      onClearSearch();
    }
  };

  return (
    <div className="w-full max-w-[200px] sm:max-w-xs md:max-w-sm lg:w-80 flex items-center px-2 sm:px-4 bg-slate-100 rounded-md">
      <input
        type="text"
        placeholder="Search notes"
        className="w-full text-sm sm:text-base md:text-xl bg-transparent outline-none py-2 sm:py-[11px]"
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
      />
      {value && (
        <IoMdClose
          className="text-base sm:text-xl text-slate-500 cursor-pointer hover:text-black mr-2 sm:mr-3 flex-shrink-0"
          onClick={onClearSearch}
        />
      )}
      <FaMagnifyingGlass
        className="text-sm sm:text-base text-slate-400 cursor-pointer hover:text-black flex-shrink-0"
        onClick={handleSearch}
      />
    </div>
  );
};

export default SearchBar;
