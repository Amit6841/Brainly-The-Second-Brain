import { useEffect, useState } from "react";
import { IoMdClose, IoMdAdd } from "react-icons/io";
import axios from "axios";
import toast from "react-hot-toast";

const Content = () => {
    const [isContent, setIsContent] = useState(false);
    const [contentData, setContentData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        link: "",
        type: "",
        tags: "",
        content: "",
    });

    const contentOpen = () => setIsContent(true);
    const contentClose = () => setIsContent(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get("/api/content");
                setContentData(response.data.data);
                console.log(contentData)
            } catch (err: any) {
                setError(err.response?.data?.message || "Failed to fetch content");
                toast.error("Failed to fetch content");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await axios.post("/api/content/", formData);
            if (response.data.success) {
                toast.success("Content added successfully");
                toast.success(response.data.message);
                setContentData((prev) => [...prev, response.data.data]); 
                setFormData({ title: "", link: "", type: "", tags: "", content: "" }); 
               contentClose()
               window.location.reload();
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to add content");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button
                onClick={contentOpen}
                className="flex items-center block text-white bg-blue-700 hover:bg-blue-800 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700"
                type="button"
            >
                <IoMdAdd className="text-xl" />
            </button>

            {isContent && (
                <div className="fixed top-7 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-black/70 ">
                    <div className="relative p-4 w-full max-w-md max-h-full">
                        <div className="relative bg-white rounded-lg shadow-sm dark:bg-[rgb(27,28,29)]">
                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Create New Content</h3>
                                <button
                                    onClick={contentClose}
                                    type="button"
                                    className="text-gray-400 bg-transparent cursor-pointer rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                                >
                                    <IoMdClose className="text-2xl" />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-4 md:p-5">
                                <div className="grid gap-4 mb-4 grid-cols-2">
                                    <div className="col-span-2">
                                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Title</label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            className="bg-gray-50 border border-gray-300 text-white text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-transparent"
                                            placeholder="Title"

                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">URL</label>
                                        <input
                                            type="text"
                                            name="link"
                                            value={formData.link}
                                            onChange={handleInputChange}
                                            className="bg-gray-50 border border-gray-300 text-white text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-transparent"
                                            placeholder="URL"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Type</label>
                                        <select
                                            name="type"
                                            value={formData.type}
                                            onChange={handleInputChange}
                                            className=" border border-gray-300 text-white text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-[rgb(27,28,29)]"
                                            required
                                        >
                                            <option value="">Select type</option>
                                            <option value="Twitter">Twitter</option>
                                            <option value="Youtube">Youtube</option>
                                            <option value="Linkedin">Linkedin</option>
                                            <option value="Document">Document</option>
                                            <option value="Instagram">Instagram</option>
                                            <option value="Spotify">Spotify</option>
                                        </select>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tags</label>
                                        <input
                                            type="text"
                                            name="tags"
                                            value={formData.tags}
                                            onChange={handleInputChange}
                                            className=" border border-gray-300 text-white text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-transparent"
                                            placeholder="Comma-separated tags"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Content</label>
                                        <textarea
                                            name="content"
                                            value={formData.content}
                                            onChange={handleInputChange}
                                            className="bg-gray-50 border border-gray-300 text-white text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-transparent"
                                            placeholder="Enter content"
                                        ></textarea>
                                    </div>
                                </div>
                                {error && <p className="text-red-500 text-sm text-center my-1">{error}</p>}
                               
                                <button
                                    onClick={() => window.location.reload()}
                                    type="submit"
                                    className="text-white cursor-pointer inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                    disabled={loading} 
                                    
                                >
                                    {loading ? "Adding..." : "Add Content"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Content;