import React, { useContext } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { Appstate } from "../App";

const Header = () => {
  const useAppstate = useContext(Appstate);
  return (
    <div className="sticky top-0 bg-slate-950 z-10 text-3xl flex justify-between items-center border-gray-500 border-b-2 font-bold p-3 text-red-800">
      <Link to={"/"}>
        <span>
          Movies
          <span className="text-yellow-500">World</span>
        </span>
      </Link>
      {useAppstate.login ? 
        <Link to={"/addmovie"}>
          <h1 className="text-lg  cursor-pointer flex items-center ">
            <Button className="text-white">
              <AddCircleOutlineIcon className="mr-1 " color="secondary" />
              <span className="text-amber-100">Add New</span>
            </Button>
          </h1>
        </Link>
        :
        <Link to={"/login"}>
          <h1 className="text-lg bg-green-600 hover:bg-green-900 rounded-md cursor-pointer flex items-center ">
            <Button className="text-white">
              <span className="text-amber-100 font-mono text-sm capitalize ">Login</span>
            </Button>
          </h1>
        </Link>

      }
    </div>
  );
};

export default Header;
