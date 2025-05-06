import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import axios from "axios";
import toast from "react-hot-toast"


const Signup = () => {
  const { setuser, setShowUserSignup, setShowUserLogin } = useAppContext();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post("/api/user/signup", { name, email, password }); 
      if (response.data.success) {
        toast.success(response.data.message);
        setuser(response.data.user);
        localStorage.setItem("token", response.data.token);
        setShowUserSignup(false);
        window.location.reload();
        console.log("Signup successful:", response.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    }
  };

  return (
    <div
      onClick={() => setShowUserSignup(false)} 
      className="absolute h-[100%] top-0 bottom-0 left-0 right-0 z-99 flex items-center justify-center text-sm text-gray-600 bg-black/60"
    >
      <div
        onClick={(e) => e.stopPropagation()} 
        className="relative p-4 w-full max-w-md max-h-full"
      >
        <div className="relative bg-white rounded-lg shadow-sm dark:bg-[rgb(27,28,29)]">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Sign up for an account
            </h3>
            <button
              onClick={() => setShowUserSignup(false)}
              type="button"
              className="text-gray-400 bg-transparent cursor-pointer  hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center  dark:hover:text-white"
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <div className="p-4 md:p-5">
            <form onSubmit={submitHandler} className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Your name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-transparent dark:text-white"
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Your email
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-transparent dark:text-white"
                  placeholder="name@company.com"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Your password
                </label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-transparent dark:text-white"
                  required
                />
              </div>
              {error && <p className="text-red-500 text-sm text-center my-1">{error}</p>}
              <button
                type="submit"
                className="w-full cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Sign up
              </button>
              <div className="text-sm text-center font-medium text-gray-500 dark:text-gray-300">
                Already registered?{" "}
                <button
                  onClick={() => {
                    setShowUserSignup(false);
                    setShowUserLogin(true);
                  }}
                  className="text-blue-700 hover:underline dark:text-blue-500 cursor-pointer"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;