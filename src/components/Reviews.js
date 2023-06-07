import React, { useContext, useEffect, useState } from "react";
import ReactStars from "react-stars";
import { Appstate } from "../App";
import { reviewsRef, db } from "../firebase/firebase";
import {
  addDoc,
  doc,
  updateDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { TailSpin, ThreeDots } from "react-loader-spinner";
import swal from "sweetalert";
import { useNavigate } from "react-router-dom";

const Reviews = ({ id, prevRating, userRated }) => {
  const useAppstate = useContext(Appstate);
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [reviewsloading, setReviewsLoading] = useState(false);
  const [form, setForm] = useState("");
  const [data, setData] = useState([]);
  const [newAdded, setNewAdded] = useState(0);

  const sendReview = async () => {
    setLoading(true);
    try {
      if (useAppstate.login) {
        await addDoc(reviewsRef, {
          movieid: id,
          name: useAppstate.userName,
          thought: form,
          rating: rating,
          timestamp: new Date().getTime()
        });
  
        const docRef = doc(db, "movies", id);
        await updateDoc(docRef, {
          rating: prevRating + rating,
          rated: userRated + 1,
        });
  
        setRating(0);
        setForm("");
        setNewAdded(newAdded + 1);
        swal({
          title: "Review Sent",
          icon: "success",
          buttons: false,
          timer: 3000
        });
      } else {
        window.alert("Login First");
        navigate('/login');

      }
     
    } catch (error) {
      swal({
        title: error.message,
        icon: "error",
        buttons: false,
        timer: 3000
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    async function getData() {
      setReviewsLoading(true);
      setData([]);
      let quer = query(reviewsRef, where("movieid", "==", id));
      const querySnapshot = await getDocs(quer);

      querySnapshot.forEach((doc) => {
        setData((prev) => [...prev, doc.data()]);
      });
      setReviewsLoading(false);
    }
    getData();
  }, [newAdded]);
  
  return (
    <div className="mt-2  border-t-2 border-gray-700 w-full">
      <ReactStars
        size={30}
        half={true}
        value={rating}
        edit={true}
        onChange={(rate) => setRating(rate)}
      />
      <input
        value={form}
        onChange={(e) => setForm(e.target.value)}
        className="w-full p-2 outline-none bg-slate-900"
        placeholder="Share your thoughts..."
      />
      <button
        onClick={sendReview}
        className="w-full flex justify-center p-2  mt-3 bg-red-950 hover:bg-red-800"
      >
        {loading ? <TailSpin height={20} color="yellow" /> : "Share"}
      </button>
      {reviewsloading ? (
        <div className="mt-6 flex justify-center">
          <ThreeDots height={10} color="red" />
        </div>
      ) : (
        <div className="mt-3 ">
          {data.map((e, i) => {
            return (
              <div className="border-b border-gray-600 p-2 w-full mt-2" key={i}>
                <div className="flex items-center justify-between ">
                  <p className="text-blue-900 font-bold text-xl">{e.name}</p>
                  <p className="ml-2 text-xs">
                    {new Date(e.timestamp).toLocaleString()}
                  </p>
                </div>
                <ReactStars
                  size={15}
                  half={true}
                  value={e.rating}
                  edit={false}
                />
                <p>{e.thought} </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Reviews;
