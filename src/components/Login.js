import React, { useContext, useState } from "react";
import { TailSpin } from "react-loader-spinner";
import { Link, useNavigate } from "react-router-dom";
import swal from "sweetalert";
import { query, where, getDocs } from "firebase/firestore";
import { usersRef } from "../firebase/firebase";
import {Appstate} from '../App'
import bcrypt from "bcryptjs-react";

const Login = () => {
  const navigate = useNavigate();
  const useAppstate = useContext(Appstate);
  const [form, setForm] = useState({
    mobile: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  const login = async () => {
    setLoading(true);
    try {
      const quer = query(usersRef, where("mobile", "==", form.mobile));
      const querySnapshot = await getDocs(quer);

      querySnapshot.forEach((doc) => {
        const _data = doc.data();
        const isUser = bcrypt.compareSync(form.password, _data.password);
        if (isUser) {
          useAppstate.setLogin(true);
          useAppstate.setUserName(_data.name);

          swal({
            title: "Logged In",
            icon: "success",
            buttons: false,
            timer: 3000,
          });
          navigate('/');
        } else {
          swal({
            title: "Invalid Credentials",
            icon: "error",
            buttons: false,
            timer: 3000
          });
        }
      });
    } catch (error) {
      swal({
        title: error.message,
        icon: "error",
        buttons: false,
        timer: 3000,
      });
    }
    setLoading(false);
    
  };
  return (
    <div className="  w-full mt-36 flex flex-col place-items-center">
      <h1 className="text-lg font-bold font-mono">_L_O_G_I_N_</h1>

      <div className="p-2 w-3/4  md:w-1/4">
        <div className="relative">
          <label htmlFor="image" className="leading-7 text-sm text-gray-300">
            Mobile No.
          </label>
          <input
            type='number'
            maxLength={10}
            id="number"
            name="number"
            autoComplete="number"
            value={form.mobile}
            onChange={(e) => setForm({ ...form, mobile: e.target.value })}
            className="w-full bg-slate-950 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
          />
        </div>
      </div>
      <div className="p-2 w-3/4 md:w-1/4">
        <div className="relative">
          <label htmlFor="password" className="leading-7 text-sm text-gray-300">
            Password
          </label>
          <input
            id="password"
            name="password"
            autoComplete="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full bg-slate-950 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
          />
        </div>
      </div>
      <div className="p-2 ">
        <button
          onClick={login}
          className="flex mx-auto   text-white bg-green-700 border-0 py-2 px-8 focus:outline-none hover:bg-green-500 rounded text-lg"
        >
          {loading ? <TailSpin height={25} color="yellow" /> : "Login"}
        </button>
        <div>
          <p className="mt-2">
            Do not have account?
            <Link to={"/signup"}>
              <span className="text-blue-600">Sign Up</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
