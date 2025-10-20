import { useState } from "react";
import TagInput from "../../components/input/TagInput";
import { MdClose } from "react-icons/md";
import { FiSave, FiEdit } from "react-icons/fi";
import axiosInstance from "../../utils/axiosInstance";

const AddEditNotes = ({
  noteData,
  getAllNotes,
  type,
  onClose,
  showToastMessage,
}) => {
  const [title, setTitle] = useState(noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [tags, setTags] = useState(noteData?.tags || []);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const addNote = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("/add-note", {
        title,
        content,
        tags,
      });
      if (response.data && response.data.note) {
        showToastMessage("Note added successfully");
        getAllNotes();
        onClose();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const editNote = async () => {
    const noteId = noteData._id;
    setLoading(true);
    try {
      const response = await axiosInstance.put("/edit-note/" + noteId, {
        title,
        content,
        tags,
      });
      if (response.data && response.data.note) {
        showToastMessage("Note updated successfully");
        getAllNotes();
        onClose();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = () => {
    if (!title) {
      setError("Title is required");
      return;
    }
    if (!content) {
      setError("Content is required");
      return;
    }
    setError("");
    if (!loading) {
      if (type === "edit") {
        editNote();
      } else {
        addNote();
      }
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
            {type === "edit" ? (
              <FiEdit className="text-white text-lg" />
            ) : (
              <FiSave className="text-white text-lg" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            {type === "edit" ? "Edit Note" : "Create New Note"}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200"
        >
          <MdClose className="text-xl text-gray-600" />
        </button>
      </div>

      <div className="space-y-5">
        <div>
          <label className="input-label">Title</label>
          <input
            type="text"
            className="w-full text-xl font-semibold text-gray-800 bg-gray-50 border-2 border-gray-200 px-5 py-3 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
            placeholder="Enter note title..."
            autoFocus={true}
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>

        <div>
          <label className="input-label">Content</label>
          <textarea
            className="w-full text-sm text-gray-700 bg-gray-50 border-2 border-gray-200 px-5 py-4 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 resize-none"
            placeholder="Write your note here..."
            rows={10}
            value={content}
            onChange={({ target }) => setContent(target.value)}
          />
        </div>

        <div>
          <label className="input-label">Tags</label>
          <TagInput tags={tags} setTags={setTags} />
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <button
            onClick={handleAddNote}
            className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <span className="animate-spin mr-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
            ) : type === "edit" ? (
              <FiEdit />
            ) : (
              <FiSave />
            )}
            {loading
              ? type === "edit"
                ? "Updating..."
                : "Saving..."
              : type === "edit"
              ? "Update Note"
              : "Save Note"}
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEditNotes;
