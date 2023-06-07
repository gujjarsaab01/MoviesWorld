import React, { useEffect, useState } from "react";
import ReactStars from "react-stars";
import { ThreeDots } from "react-loader-spinner";
import { getDocs } from "firebase/firestore";
import { moviesRef } from "../firebase/firebase";
import { Link } from "react-router-dom";

const Cards = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getData() {
      setLoading(true);
      setData([]); // Clear the data state before fetching new data
      const querySnapshot = await getDocs(moviesRef);
      const _data = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setData(_data);
      setLoading(false);
    }
    getData();
  }, []);

  return (
    <div className="flex flex-wrap justify-between px-3 mt-2 ">
      {loading ? (
        <div className=" w-full flex justify-center items-center h-screen">
          {" "}
          <ThreeDots height={40} color="red" />
        </div>
      ) : (
        data.map((e, i) => {
          return (
            <Link to={`/detail/${e.id}`}key={i}>
              <div
                
                className="bg-slate-900  rounded-lg max-w-40 overflow-hidden font-medium shadow-lg p-2 hover:-translate-y-2 cursor-pointer mt-6 transition-all duration-600"
              >
                <img className=" h-60  md:h-72  rounded-lg " src={e.image} />
                <h1>
                  {" "}
                  {e.title.length > 20
                    ? e.title.substring(0, 20) + "..."
                    : e.title}
                </h1>
                <h1 className="flex place-items-center ">
                  <span className="text-amber-700 mr-1">Rating:</span>
                  <ReactStars
                    size={20}
                    half={true}
                    value={e.rating/e.rated}
                    edit={false}
                  />
                </h1>
                <h1>
                  <span className="text-amber-700">Year:</span> {e.year}
                </h1>
              </div>
            </Link>
          );
        })
      )}
    </div>
  );
};

export default Cards;
