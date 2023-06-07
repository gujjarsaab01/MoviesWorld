import React, { useState } from "react";
import { TailSpin } from "react-loader-spinner";
import { Link } from "react-router-dom";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import bcrypt from "bcryptjs-react";
import app, { usersRef } from "../firebase/firebase";
import swal from "sweetalert";
import { addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const auth = getAuth(app);

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    mobile: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [OTP, setOTP] = useState("");

  const generateRecaptha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        callback: (response) => {},
      },
      auth
    );
  };

  const requestOtp = () => {
    setLoading(true);
    generateRecaptha();
    let appVerifier = window.recaptchaVerifier;
    signInWithPhoneNumber(auth, `+91${form.mobile}`, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        swal({
          text: "OTP Sent",
          icon: "success",
          buttons: false,
          timer: 3000,
        });
        setOtpSent(true);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const verifyOTP = () => {
    try {
      setLoading(true);
      window.confirmationResult.confirm(OTP).then((result) => {
        uploadData();
        swal({
          text: "Successfully Registerd",
          icon: "success",
          buttons: false,
          timer: 3000,
        });
        navigate("/login");
        setLoading(false);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const uploadData = async () => {
    try {
      const salt = bcrypt.genSaltSync(10);
      var hash = bcrypt.hashSync(form.password, salt);
      await addDoc(usersRef, {
        name: form.name,
        password: hash,
        mobile: form.mobile,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="sticky w-full mt-10 flex flex-col items-center justify-center">
      {otpSent ? (
        <>
          <h1 className="text-lg font-bold font-mono">_E_N_T_E_R__O_T_P_</h1>
          <div className="p-2 w-2/4 md:w-1/4">
            <div className="relative">
              <label
                htmlFor="image"
                className="leading-7 text-sm text-gray-300"
              >
                OTP
              </label>
              <input
                maxLength={10}
                id="message"
                name="message"
                value={OTP}
                onChange={(e) => setOTP(e.target.value)}
                className="w-full bg-slate-950 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
          </div>
          <div className="p-2 w-full">
            <button
              onClick={verifyOTP}
              className="flex mx-auto   text-white bg-green-700 border-0 py-2 px-8 focus:outline-none hover:bg-green-500 rounded text-lg"
            >
              {loading ? (
                <TailSpin height={25} color="yellow" />
              ) : (
                "Confirm OTP"
              )}
            </button>
          </div>
        </>
      ) : (
        <>
          <h1 className="text-lg font-bold font-mono">_S_I_G_N_U_P_</h1>
          <div className="p-2 w-3/4 md:w-1/4">
            <div className="relative">
              <label
                htmlFor="message"
                className="leading-7 text-sm text-gray-300"
              >
                Name
              </label>
              <input
              autoComplete="name"
                type="text"
                id="message"
                name="message"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-slate-950 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
          </div>
          <div className="p-2 w-3/4 md:w-1/4">
            <div className="relative">
              <label
                htmlFor="message"
                className="leading-7 text-sm text-gray-300"
              >
                Mobile No.
              </label>
              <input
              autoComplete="mobile"
                type='number'
                maxLength={10}
                id="message"
                name="message"
                value={form.mobile}
                onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                className="w-full bg-slate-950 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
          </div>
          <div className="p-2 w-3/4 md:w-1/4">
            <div className="relative">
              <label
                htmlFor="message"
                className="leading-7 text-sm text-gray-300"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-slate-950 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
          </div>
          <div className="p-2 w-full">
            <button
              onClick={requestOtp}
              className="flex mx-auto   text-white bg-green-700 border-0 py-2 px-8 focus:outline-none hover:bg-green-500 rounded text-lg"
            >
              {loading ? (
                <TailSpin height={25} color="yellow" />
              ) : (
                "Request OTP"
              )}
            </button>
          </div>
        </>
      )}
      <div>
        <p>
          Already have an account.
          <Link to={"/login"}>
            <span className="text-blue-600 ml-2">Login</span>
          </Link>
        </p>
      </div>
      <div id="recaptcha-container"></div>
    </div>
  );
};

export default Signup;
