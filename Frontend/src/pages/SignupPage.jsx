import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Input from '../components/Input'
import { useState, useEffect } from 'react'
import PasswordStrengthMeter from '../components/PasswordStrengthMeter'
import { Loader, Lock, Mail, User, Eye, EyeOff } from "lucide-react";
import { validatePassword } from '../components/PasswordStrengthMeter'
import { toast } from 'react-toastify'
import { useAuthStore } from "../store/authStore";


const SignupPage = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showStrength, setShowStrength] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const { signup, error, isLoading, resetError } = useAuthStore();

  useEffect(() => {
    resetError();
  }, [resetError]);

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!validatePassword(formData.password)) {
      toast.error("Password is not strong enough");
      return;
    }

    try {
      await signup(formData);
      // console.log(formData);
      setShowStrength(false);
      toast.success("Account created successfully");
      navigate("/verify-email");
    } catch (error) {
      toast.error("Failed to Create Account")
      console.log(error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl 
			overflow-hidden mx-5 md:mx-0"
    >
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-cyan-400 to-sky-500 text-transparent bg-clip-text">
          Create Account
        </h2>

        <form onSubmit={handleSignUp}>
          <Input
            icon={User}
            type="text"
            placeholder="First Name"
            value={formData.firstname}
            onChange={(e) =>
              setFormData({ ...formData, firstname: e.target.value })
            }
          />
          <Input
            icon={User}
            type="text"
            placeholder="Last Name"
            value={formData.lastname}
            onChange={(e) =>
              setFormData({ ...formData, lastname: e.target.value })
            }
          />
          <Input
            icon={Mail}
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <div className="relative mb-6">
            <Input
              icon={Lock}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value }),
                  setShowStrength(true);
              }}
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
          {showStrength && (
            <PasswordStrengthMeter password={formData.password} />
          )}
          {error && (
            <p className="text-red-500 text-xs font-semibold mt-2">{error}</p>
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
              "Sign Up"
            )}
          </motion.button>
        </form>
      </div>
      <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
        <p className="text-sm text-gray-400">
          Already have an account?{" "}
          <Link to={"/login"} className="text-cyan-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </motion.div>
  );
}

export default SignupPage