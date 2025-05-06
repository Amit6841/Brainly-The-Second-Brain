import { useState } from "react";
import { IoMdClose, IoMdShare } from "react-icons/io";
import { FiCopy } from "react-icons/fi";
import axios from "axios";
import toast from "react-hot-toast";

interface ShareError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const Share = () => {
    const [isShare, setIsShare] = useState(false);
    const [loading, setLoading] = useState(false);
    const [shareToken, setShareToken] = useState<string | null>(null);

    const shareOpen = () => setIsShare(true);
    const shareClose = () => {
        setIsShare(false);
        setShareToken(null);
    };

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success("Link copied to clipboard!");
        } catch (err) {
            toast.error("Failed to copy link");
        }
    };

    const handleShare = async () => {
        setLoading(true);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/brain/share`,
                {},
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.data.success) {
                setShareToken(response.data.shareToken);
                toast.success("Brain shared successfully!");
            }
        } catch (err: unknown) {
            const error = err as ShareError;
            toast.error(error.response?.data?.message || "Failed to share brain");
            console.error("Share error:", err);
        } finally {
            setLoading(false);
        }
    };

    const getShareUrl = () => {
        const baseUrl = import.meta.env.VITE_APP_URL || window.location.origin;
        return `${baseUrl}/share/${shareToken}`;
    };

    return (
        <div>
            <button
                onClick={shareOpen}
                className="flex items-center cursor-pointer gap-2 block text-white bg-blue-700 hover:bg-blue-800 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700"
                type="button"
            >
                <IoMdShare className="text-xl" />
                Share
            </button>

            {isShare && (
                <div className="fixed top-0 right-0 left-0 z-100 flex justify-center items-center w-full h-full bg-black/70">
                    <div className="relative p-4 w-full max-w-2xl max-h-full">
                        <div className="relative bg-white rounded-lg shadow-sm dark:bg-[rgb(27,28,29)]">
                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Share Your Second Brain
                                </h3>
                                <button
                                    onClick={shareClose}
                                    type="button"
                                    className="text-gray-400 bg-transparent cursor-pointer hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                >
                                    <IoMdClose className="text-2xl" />
                                </button>
                            </div>
                            <div className="p-4 md:p-5 space-y-4">
                                {shareToken ? (
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            readOnly
                                            value={getShareUrl()}
                                            className="w-full p-2 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        />
                                        <button
                                            onClick={() => copyToClipboard(getShareUrl())}
                                            className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                                        >
                                            <FiCopy className="text-xl" />
                                        </button>
                                    </div>
                                ) : (
                                    <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                                        Share your entire collection of notes, documents, tweets, and videos with others. They'll be able to import your content into their own Second Brain.
                                    </p>
                                )}
                            </div>
                            <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                                <button
                                    onClick={handleShare}
                                    type="button"
                                    className="text-white cursor-pointer bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Sharing...
                                        </div>
                                    ) : (
                                        "Share Brain"
                                    )}
                                </button>
                                <button
                                    onClick={shareClose}
                                    type="button"
                                    className="py-2.5 px-5 ms-3 cursor-pointer text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-grey-300 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Share;