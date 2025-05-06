import { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import axios from "axios";
import toast from "react-hot-toast";

interface EditContentProps {
  isEditModalOpen: boolean;
  closeEditModal: () => void;
  contentId: string;
  initialData: {
    title: string;
    link: string;
    type: string;
    tags?: string[];
  };
  onUpdate?: () => void;
}

interface ApiError {
  response?: {
    status: number;
    data: {
      message?: string;
    };
  };
  message: string;
}

const EditContent = ({
  isEditModalOpen,
  closeEditModal,
  contentId,
  initialData,
  onUpdate,
}: EditContentProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    link: "",
    type: "",
    tags: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        link: initialData.link || "",
        type: initialData.type || "",
        tags: initialData.tags?.join(", ") || "",
      });
    }
  }, [initialData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {

    if (!formData.type) {
      toast.error("Please select a content type");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (!contentId) {
        throw new Error("Content ID is missing");
      }

      const payload = {
        title: formData.title.trim(),
        link: formData.link.trim(),
        type: formData.type,
        tags: formData.tags
          .split(",")
          .map(tag => tag.trim())
          .filter(Boolean),
      };

      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/content/${contentId}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success("Content updated successfully!");
        onUpdate?.();
        closeEditModal();
        window.location.reload();
      } else {
        throw new Error(response.data.message || "Failed to update content");
      }
    } catch (error) {
      const err = error as ApiError;
      let errorMessage = "Failed to update content";

      if (err.response) {
        switch (err.response.status) {
          case 401:
            errorMessage = "Your session has expired. Please log in again.";
            // Optionally redirect to login page
            break;
          case 403:
            errorMessage = "You don't have permission to edit this content.";
            break;
          case 404:
            errorMessage = "The content you're trying to edit was not found.";
            break;
          case 422:
            errorMessage = "Please check your input and try again.";
            break;
          default:
            errorMessage = err.response.data?.message || "An error occurred while updating content";
        }
      } else if (err.message) {
        errorMessage = err.message;
      }

      toast.error(errorMessage);
      console.error("Update error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isEditModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
      <div className="relative p-4 w-full max-w-md max-h-full">
        <div className="relative bg-white rounded-lg shadow-sm dark:bg-[rgb(27,28,29)]">
          <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600 border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Edit Content
            </h3>
            <button
              onClick={closeEditModal}
              className="text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg p-2"
            >
              <IoMdClose className="text-2xl" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Title"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500  dark:text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                URL
              </label>
              <input
                type="text"
                name="link"
                value={formData.link}
                onChange={handleInputChange}
                placeholder="URL"
                required
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500  dark:text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 bg-[rgb(27,28,29)] dark:text-white"
              >
                <option value="">Select type</option>
                <option value="Twitter">Twitter</option>
                <option value="Youtube">Youtube</option>
                <option value="Document">Document</option>
                <option value="Instagram">Instagram</option>
                <option value="Spotify">spotify</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Tags
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="Comma-separated tags"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500  dark:text-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                "Update Content"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditContent;
