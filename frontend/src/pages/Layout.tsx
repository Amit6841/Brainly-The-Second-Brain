import { useState } from "react";
import { GiBrain } from "react-icons/gi";
import { FaBrain, FaLink } from "react-icons/fa6";
import { FaTwitter, FaYoutube, FaInstagram, FaSpotify } from "react-icons/fa";
import { IoDocument } from "react-icons/io5";
import { IoMenu } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { Link, Outlet } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { user, axios, setuser, setShowUserLogin, setShowUserSignup } = useAppContext();

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

    const logout = async () => {
        try {
            const { data } = await axios.get('/api/user/logout');
            if (data.success) {
                toast.success(data.message);
                localStorage.removeItem("token");
                setuser(false);
                window.location.reload();
            } else {
                toast.error(data.message);
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    return (
        <div className="min-h-screen w-full bg-black text-black transition-colors duration-200">
            <nav className="bg-black border-b border-gray-400 dark:border-[rgb(188, 188, 188)] fixed top-0 z-80 w-full">
                <div className="px-3 py-3 lg:px-5 lg:pl-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center justify-start rtl:justify-end">
                            <button
                                onClick={toggleSidebar}
                                aria-controls="logo-sidebar"
                                type="button"
                                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                            >
                                <IoMenu className="text-xl" />
                            </button>
                            <Link to="/" className="flex items-center gap-3 ms-2 md:me-24">
                                <GiBrain className=" text-3xl text-white" />
                                <span className="self-center text-white text-xl font-semibold sm:text-2xl whitespace-nowrap">
                                    Brainly
                                </span>
                            </Link>
                        </div>

                        <div className="flex items-center">
                            {!user ? (
                                <button
                                    onClick={() => { setShowUserLogin(true); setShowUserSignup(false); }}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                                >
                                    login
                                </button>
                            ) : (
                                <div className="flex items-center ms-3">
                                    <div>
                                        <button
                                            onClick={toggleDropdown}
                                            type="button"
                                            className="flex text-sm bg-[rgb(40,42,44)] rounded-full text-white"
                                        >
                                            <CgProfile className="text-4xl p-1" />
                                        </button>
                                    </div>
                                    {isDropdownOpen && (
                                        <div className="absolute z-50 top-8 right-10 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-md shadow-2xl dark:bg-[rgb(40,42,44)] dark:divide-gray-600 border border-gray-500">
                                            <div>
                                                {user && user.name && (
                                                    <>
                                                        <div className="px-5 py-3">
                                                            <p className="text-sm text-gray-900 dark:text-white">{user.name}</p>
                                                            <p className="text-sm font-medium text-gray-900 truncate dark:text-gray-300">
                                                                {user.email}
                                                            </p>
                                                        </div>

                                                        <button
                                                            onClick={logout}
                                                            className="w-full cursor-pointer block py-3 text-sm  border-t dark:text-gray-300 "
                                                        >
                                                            logout
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <aside className={`bg-[rgb(28,28,28)] border-r fixed top-0 left-0 w-50 h-screen pt-15 transition-transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="h-full flex flex-col justify-between px-3 py-4 overflow-y-auto ">
                    <ul className="space-y-2 font-medium text-white">
                        <li>
                            <Link
                                to="/"
                                className="flex items-center p-2  rounded-lg  dark:hover:bg-[rgb(40,42,44)]  group"
                            >
                                <FaBrain />
                                <span className="ms-3">My Brain</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/twitter"
                                className="flex items-center p-2  rounded-lg   hover:bg-gray-100 dark:hover:bg-[rgb(40,42,44)] group"
                            >
                                <FaTwitter />
                                <span className="flex-1 ms-3 whitespace-nowrap">Twitter</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/youtube"
                                className="flex items-center p-2 rounded-lg  hover:bg-gray-100 dark:hover:bg-[rgb(40,42,44)] group"
                            >
                                <FaYoutube />
                                <span className="flex-1 ms-3 whitespace-nowrap">YouTube</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/documents"
                                className="flex items-center p-2 rounded-lg   hover:bg-gray-100 dark:hover:bg-[rgb(40,42,44)] group"
                            >
                                <IoDocument />
                                <span className="flex-1 ms-3 whitespace-nowrap">Documents</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/instagram"
                                className="flex items-center p-2 rounded-lg   hover:bg-gray-100 dark:hover:bg-[rgb(40,42,44)] group"
                            >
                                <FaInstagram />
                                <span className="flex-1 ms-3 whitespace-nowrap">Instagram</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/spotify"
                                className="flex items-center p-2 rounded-lg   hover:bg-gray-100 dark:hover:bg-[rgb(40,42,44)] group"
                            >
                                <FaSpotify />
                                <span className="flex-1 ms-3 whitespace-nowrap">Spotify</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/linkedin"
                                className="flex items-center p-2 rounded-lg   hover:bg-gray-100 dark:hover:bg-[rgb(40,42,44)] group"
                            >
                                <FaLink />
                                <span className="flex-1 ms-3 whitespace-nowrap">Linkedin</span>
                            </Link>
                        </li>
                    </ul>
                </div>

            </aside>

            <main className="lg:pl-50 w-full pt-15 bg-black">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
