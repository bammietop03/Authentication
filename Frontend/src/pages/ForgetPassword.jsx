import { motion } from "framer-motion"
import Input from "../components/Input"
import { Mail } from "lucide-react"
import { useState, useEffect  } from "react"
import { useAuthStore } from "../store/authStore";
import { Link } from "react-router-dom"
import { Loader, ArrowLeft } from "lucide-react"

const ForgetPassword = () => {

  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { forgetPassword, error, isLoading, resetError } = useAuthStore();

  useEffect(() => {
    resetError();
  }, [resetError]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await forgetPassword(email);
      setIsSubmitted(true);
    } catch (error) {
      console.error(error.response.data.message || "Error sending reset link");

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
          Forget Password
        </h2>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit}>
            <Input
              icon={Mail}
              type="email"
              placeholder="Email Address"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
            {error && (
              <p className="text-red-500 text-xs font-semibold">{error}</p>
            )}
            <motion.button
              className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-sky-600 text-white 
              font-bold rounded-lg shadow-lg hover:from-cyan-600
              hover:to-sky-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2
              focus:ring-offset-gray-900 transition duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
            >
              {isLoading ? (
                <Loader className="size-6 animate-spin mx-auto" />
              ) : (
                "Send Reset Link"
              )}
            </motion.button>
          </form>
        ) : (
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="w-16 h-16 bg-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Mail className="h-8 w-8 text-white" />
            </motion.div>
            <p className="text-gray-300 mb-6">
              If an account exists for {email}, you will receive a password
              reset link shortly.
            </p>
          </div>
        )}
      </div>
      <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
        <Link
          to={"/login"}
          className="text-sm text-cyan-400 hover:underline flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Login
        </Link>
      </div>
    </motion.div>
  );
}

export default ForgetPassword