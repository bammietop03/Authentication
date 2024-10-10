import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Input from '../components/Input'
import { motion } from 'framer-motion'
import { Loader, Lock, Mail, Eye, EyeOff } from 'lucide-react'
import { useAuthStore } from "../store/authStore";
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'


const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate();
  const { login, isLoading, error, resetError, googleLogin } = useAuthStore();

  useEffect(() => {
    resetError();
  }, [resetError]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await login(formData);
      toast.success('Login Successfull')
      navigate("/");
    } catch (error) {
      throw error;     
    }
  }

  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl 
			overflow-hidden mx-5 md:mx-0"
    >
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-cyan-400 to-sky-500 text-transparent bg-clip-text pb-2">
          Login
        </h2>
        <form onSubmit={handleLogin}>
          <Input
            icon={Mail}
            type="email"
            placeholder="Email"
            value={formData.email}
            required
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value })
            }}
            
          />
          <div className="relative">
            <Input
              icon={Lock}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              required
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            <div
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <EyeOff className="size-4 text-cyan-500" />
              ) : (
                <Eye className=" size-4 text-cyan-500" />
              )}
            </div>
          </div>
          <div className="flex items-center mb-3">
            <Link
              to="/forget-password"
              className="text-sm text-cyan-400 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          {error && (
            <p className="text-red-500 text-xs text-center font-semibold mt-2">
              {error}
            </p>
          )}
          <motion.button
            className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-sky-600 text-white 
						font-bold rounded-lg shadow-lg hover:from-cyan-600
						hover:to-sky-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2
						 focus:ring-offset-gray-900 transition duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className=" animate-spin mx-auto" size={24} />
            ) : (
              "Login"
            )}
          </motion.button>
        </form>
      </div>
      <div className="flex justify-center items-center gap-2 pb-4 px-16">
        <hr className="w-1/2 border-gray-500" />
        <p className="text-gray-400">Or</p>
        <hr className="w-1/2 border-gray-500" />
      </div>
      <div className="flex justify-center  items-center pb-8 px-8">
        <motion.button
          className="flex mx-auto justify-center gap-2 mt-5 w-full py-2 px-4 bg-white 
						font-bold rounded-lg shadow-lg hover:from-cyan-600
						hover:to-sky-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2
						 focus:ring-offset-gray-900 transition duration-200"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={googleLogin}
        >
          <img
            src="https://img.icons8.com/color/48/000000/google-logo.png"
            alt="google"
            className="w-8 h-8 "
          />
          <h2 className="text-gray-700 text-md mt-1">Google</h2>
        </motion.button>
      </div>
      <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
        <p className="text-sm text-gray-400">
          Don't have an account?{" "}
          <Link to={"/signup"} className="text-cyan-400 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </motion.div>
  );
}

export default LoginPage