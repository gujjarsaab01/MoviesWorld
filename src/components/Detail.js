import React, { useEffect, useState } from "react";
import ReactStars from "react-stars";
import { useParams } from "react-router-dom";
import { db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Bars } from "react-loader-spinner";
import Reviews from "./Reviews";

const Detail = () => {
  const { id } = useParams();
  // window.alert(id);
  const [data, setData] = useState({
    title: "",
    year: "",
    image: "",
    description: "",
    rating: 0,
    rated: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getData() {
      setLoading(true);
      const _doc = doc(db, "movies", id);
      const _data = await getDoc(_doc);
      setData(_data.data());
      setLoading(false);
    }
    getData();
  }, []);
  return (
    <div className="p-4 mt-4 w-full flex flex-col md:flex-row items-center md:items-start justify-center">
      {loading ? (
        <div className="h-screen  flex justify-center items-center w-full">
          <Bars height={40} color="red" />
        </div>
      ) : (
        <>
          <img src={data.image} className="md:sticky top-20 h-96" />
          <div className="md:ml-4 ml-0  w-full md:w-1/2">
            <h1 className="text-3xl text-gray-500 font-bold font-serif">
              {data.title}
              <span className="text-xl"> ({data.year})</span>
            </h1>
            <ReactStars size={20} half={true} value={data.rating/data.rated} edit={false} />
            <p className="mt-3">{data.description}</p>

            <Reviews id={id} prevRating={data.rating} userRated={data.rated} />
          </div>
        </>
      )}
    </div>
  );
};

export default Detail;
