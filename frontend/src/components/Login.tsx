import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const { setuser, setShowUserLogin, setShowUserSignup } = useAppContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post("/api/user/login", { email, password });
      if (response.data.success) {
        toast.success(response.data.message);
        setuser(response.data.user);
        localStorage.setItem("token", response.data.token);
        setShowUserLogin(false);
        window.location.reload();
        console.log("Login successful:", response.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70">
        <div className="min-w-[350px] max-w-[400px] bg-white rounded-lg shadow-sm dark:bg-[rgb(27,28,29)]">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
            <h3 className="text-xl  font-semibold text-gray-900 dark:text-white">
              Login to your account
            </h3>
            <button
              onClick={() => setShowUserLogin(false)}
              type="button"
              className="text-gray-400 cursor-pointer bg-transparent  hover:text-white rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center "
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
                  Your email
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  name="email"
                  id="email"
                  className="w-full p-2 border rounded  text-gray-900 dark:text-white"
                  placeholder="name@company.com"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Your password
                </label>
                <div className="relative">
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    placeholder={showPassword ? "password" : "*******"}
                    className="w-full p-2 border rounded text-gray-900 dark:text-white pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer dark:text-gray-400 dark:hover:text-gray-300"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="w-5 h-5" />
                    ) : (
                      <FaEye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
              {error && <p className="text-red-500 text-sm text-center my-1">{error}</p>}
              <button
                type="submit"
                className="w-full px-4 py-2 cursor-pointer text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                Login to your account
              </button>
              <div className="text-sm text-center font-medium text-gray-500 dark:text-gray-300">
                Not registered?{" "}
                <button onClick={() => { setShowUserSignup(true); setShowUserLogin(false) }} className="text-blue-700 cursor-pointer hover:underline dark:text-blue-500">
                  signup
                </button>

              </div>
            </form>
          </div>
      </div>
    </div>
  );
};

export default Login;