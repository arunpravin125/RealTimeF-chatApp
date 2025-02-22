import React, { useState } from "react";
import useSignUp from "../../hooks/useSignUp";
import { Link } from "react-router-dom";

const SignUp = () => {
  const [userData, setUserData] = useState({
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });

  const { handleSignUp, loading } = useSignUp();

  const signUpBtn = (e) => {
    e.preventDefault();
    handleSignUp(userData);
  };

  return (
    <div className="flex items-center justify-center min-w-96 bg-blue-400">
      <div className="bg-gray-50 font-[sans-serif]">
        <div className="min-h-screen flex flex-col items-center justify-center py-3 px-4">
          <div className="max-w-md w-full">
            <div className="p-10 rounded-2xl bg-white shadow">
              <h2 className="text-gray-800 text-center text-2xl font-bold">
                Sign Up
              </h2>
              <form className="mt-4 space-y-4" onSubmit={signUpBtn}>
                {/* Full Name */}
                <div>
                  <label className="text-gray-800 text-sm mb-2 block">
                    Full Name
                  </label>
                  <input
                    value={userData.fullName}
                    onChange={(e) =>
                      setUserData((prev) => ({ ...prev, fullName: e.target.value }))
                    }
                    type="text"
                    required
                    className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
                    placeholder="Enter full name"
                  />
                </div>

                {/* Username */}
                <div>
                  <label className="text-gray-800 text-sm mb-2 block">
                    Username
                  </label>
                  <input
                    value={userData.username}
                    onChange={(e) =>
                      setUserData((prev) => ({ ...prev, username: e.target.value }))
                    }
                    type="text"
                    required
                    className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
                    placeholder="Enter username"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="text-gray-800 text-sm mb-2 block">
                    Password
                  </label>
                  <input
                    value={userData.password}
                    onChange={(e) =>
                      setUserData((prev) => ({ ...prev, password: e.target.value }))
                    }
                    type="password"
                    required
                    className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
                    placeholder="Enter password"
                  />
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="text-gray-800 text-sm mb-2 block">
                    Confirm Password
                  </label>
                  <input
                    value={userData.confirmPassword}
                    onChange={(e) =>
                      setUserData((prev) => ({ ...prev, confirmPassword: e.target.value }))
                    }
                    type="password"
                    required
                    className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
                    placeholder="Confirm password"
                  />
                </div>

                {/* Gender Selection */}
                <div>
                  <label className="text-gray-800 text-sm mb-2 block">
                    Gender
                  </label>
                  <div className="flex gap-5 items-center">
                    <div className="flex gap-2">
                      <input
                        type="radio"
                        name="gender"
                        value="male"
                        checked={userData.gender === "male"}
                        onChange={(e) =>
                          setUserData((prev) => ({ ...prev, gender: e.target.value }))
                        }
                        required
                        className="h-5 w-5"
                      />
                      <p>Male</p>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="radio"
                        name="gender"
                        value="female"
                        checked={userData.gender === "female"}
                        onChange={(e) =>
                          setUserData((prev) => ({ ...prev, gender: e.target.value }))
                        }
                        required
                        className="h-5 w-5"
                      />
                      <p>Female</p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="mt-3">
                  <button
                    type="submit"
                    className="w-full py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                  >
                    {loading ? (
                      <span className="loading loading-spinner loading-md"></span>
                    ) : (
                      "Sign Up"
                    )}
                  </button>
                </div>

                {/* Redirect Link */}
                <p className="text-gray-800 text-sm mt-3 text-center">
                  Already have an account?{" "}
                  <Link to="/login" className="underline hover:text-blue-300" >Login here</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
