import axios from "axios";
import toast from "react-hot-toast";
import { useState } from "react";
import { useAppContext } from "../context/AppContext";

interface DeleteProps {
  isDeleteModalOpen: boolean;
  closeDeleteModal: () => void;
  contentId: string;
  onDelete: (id: string) => void;
}

interface ApiResponse {
  success: boolean;
  message?: string;
}

const Delete = ({
  isDeleteModalOpen,
  closeDeleteModal,
  contentId,
  onDelete,
}: DeleteProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { navigate } = useAppContext()

  const handleDelete = async () => {
    if (!contentId) {
      toast.error("Invalid content ID");
      return;
    }

    setIsDeleting(true);
    try {
      const result = await axios.delete<ApiResponse>(
        `${import.meta.env.VITE_BACKEND_URL}/api/content/${contentId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (result.data.success) {
        closeDeleteModal();
        toast.success("Content deleted successfully!");
        onDelete(contentId);
        navigate("/");
        window.location.reload();

      } else {
        throw new Error(result.data.message || "Failed to delete content");
      }
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : "Failed to delete content";
      toast.error(errorMessage);
      console.error("Delete error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isDeleteModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70">
      <div className="w-full max-w-md p-6 bg-white dark:bg-[rgb(27,28,29)] rounded-lg shadow-xl">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Confirm Deletion
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Are you sure you want to delete this?
        </p>
        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={closeDeleteModal}
            disabled={isDeleting}
            className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
          >
            {isDeleting ? (
              <>
                <span className="flex items-center justify-center space-x-2">
                Deleting...
                </span>
              </>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Delete;
