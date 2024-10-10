import { useState, useEffect } from "react"
import { Lock, Eye, EyeOff } from "lucide-react"
import Input from "../components/Input"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "../store/authStore";
import { toast } from "react-toastify"
import { useParams } from "react-router-dom"
import PasswordStrengthMeter from "../components/PasswordStrengthMeter"
import { validatePassword } from "../components/PasswordStrengthMeter"

const ResetPassword = () => {

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showStrength, setShowStrength] = useState(false)

  const { resetPassword, error, isLoading, resetError } = useAuthStore();
  const {token } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    resetError();
  }, [resetError]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();



    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match")
      return;
    }

    if (!validatePassword(formData.password)) {
      toast.error("Password is not strong enough");
      return;
    }
    try {
      await resetPassword(formData.password, token);
      toast.success(
        "Password reset successfully, redirecting to login page..."
      );
      navigate("/login");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Error resetting password");
    }
    // console.log(formData)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden mx-5 md:mx-0"
    >
      <div className="p-8">
        <h2 className="font-bold text-center text-3xl mb-6 bg-gradient-to-r from-cyan-500 to-sky-600 text-transparent bg-clip-text ">
          Reset Password
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="relative mb-3">
            <Input
              icon={Lock}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
                setShowStrength(true);
              }}
              required
            />
            <div
              className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <EyeOff className="text-cyan-500 size-4" />
              ) : (
                <Eye className="text-cyan-500 size-4" />
              )}
            </div>
          </div>
          {showStrength && (
            <PasswordStrengthMeter password={formData.password} />
          )}
          <div className="relative my-6">
            <Input
              icon={Lock}
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={(e) => {
                setFormData({ ...formData, confirmPassword: e.target.value });
                setShowStrength(false);
              }}
              required
            />
            <div
              className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <EyeOff className="text-cyan-500 size-4" />
              ) : (
                <Eye className="text-cyan-500 size-4" />
              )}
            </div>
          </div>
          {error && <p className="text-red-500 text-xs mb-3">{error}</p>}
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
            {isLoading ? "Resetting Password..." : "Reset Password"}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}

export default ResetPassword