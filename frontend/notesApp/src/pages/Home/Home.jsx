import { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import NoteCard from "../../components/Cards/NoteCard";
import { MdAdd } from "react-icons/md";
import AddEditNotes from "./AddEditNotes";
import Modal from "react-modal";
import axiosInstance from "../../utils/axiosInstance";
import Toast from "./../../components/ToastMessage/Toast";
import EmptyCard from "../../components/EmptyCard/EmptyCard";
import addNoteImg from "../../assets/images/Addnotesbro.svg";
import noData from "../../assets/images/Nodata.svg";
import { useNotesStore } from "../../store";
import { useGetNotes } from "../../libs";

const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShow: false,
    type: "add",
    data: null,
  });

  const [showtoastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    type: "add",
  });

  const { mutate } = useGetNotes();
  const allNotes = useNotesStore((state) => state.notes ?? []);

  const [isSearch] = useState(false);
  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({ isShow: true, data: noteDetails, type: "edit" });
  };

  const showToastMessage = (message, type) => {
    setShowToastMsg({
      isShown: true,
      message,
      type,
    });
  };
  const handleCloseToast = () => {
    setShowToastMsg({
      isShown: false,
      message: "",
    });
  };

  //delete note
  const deleteNote = async (data) => {
    const noteId = data._id;

    try {
      const response = await axiosInstance.delete("/delete-note/" + noteId);

      if (response.data && !response.data.error) {
        showToastMessage("Note deleted successfully", "delete");
        mutate(); // Refresh the notes list
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        console.log("an unexpected error occured please try again");
      }
    }
  };

  //update is pinned
  const updateIsPinned = async (noteData) => {
    const noteId = noteData._id;

    try {
      const response = await axiosInstance.put(
        "/update-note-pinned/" + noteId,
        {
          isPinned: !noteData.isPinned,
        }
      );

      if (response.data && response.data.note) {
        showToastMessage("note updated Successfully");
        mutate(); // Refresh the notes list
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Navbar />

      <div className="container px-6 mx-auto py-8">
        {/* Header Section */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
            My Notes
          </h1>
          <p className="text-gray-600">
            {allNotes?.length > 0
              ? `You have ${allNotes.length} note${
                  allNotes.length > 1 ? "s" : ""
                }`
              : "Start creating your first note!"}
          </p>
        </div>

        {allNotes?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
            {allNotes.map((item) => (
              <NoteCard
                key={item._id}
                title={item.title}
                date={item.createOn}
                content={item.content}
                tags={item.tags}
                isPinned={item.isPinned}
                onEdit={() => handleEdit(item)}
                onDelete={() => deleteNote(item)}
                onPinNote={() => updateIsPinned(item)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <EmptyCard
              imgSrc={isSearch ? noData : addNoteImg}
              msg={
                isSearch
                  ? `Oops! No notes found matching your search.`
                  : `Start creating your first note! Click the '+' button to write down your thoughts and ideas!`
              }
            />
          </div>
        )}
      </div>

      {/* Floating Add Button */}
      <button
        className="fixed right-4 bottom-4 sm:right-8 sm:bottom-8 w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-2xl bg-gradient-to-r from-primary to-secondary text-white shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 z-50 group"
        onClick={() => {
          setOpenAddEditModal({ isShow: true, type: "add", data: null });
        }}
      >
        <MdAdd className="text-2xl sm:text-3xl group-hover:rotate-90 transition-transform duration-300" />
      </button>

      {/* Modal */}
      <Modal
        isOpen={openAddEditModal.isShow}
        onRequestClose={() => {
          setOpenAddEditModal({ isShow: false, type: "add", data: null });
        }}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(4px)",
            zIndex: 1000,
          },
        }}
        contentLabel=""
        className="w-[95%] max-w-2xl mx-auto mt-20 outline-none"
      >
        <div className="glass rounded-3xl shadow-2xl p-8 max-h-[85vh] overflow-y-auto">
          <AddEditNotes
            type={openAddEditModal.type}
            noteData={openAddEditModal.data}
            onClose={() => {
              setOpenAddEditModal({ isShow: false, type: "add", data: null });
            }}
            getAllNotes={mutate}
            showToastMessage={showToastMessage}
          />
        </div>
      </Modal>

      <Toast
        isShown={showtoastMsg.isShown}
        message={showtoastMsg.message}
        type={showtoastMsg.type}
        onClose={handleCloseToast}
      />
    </div>
  );
};

export default Home;
