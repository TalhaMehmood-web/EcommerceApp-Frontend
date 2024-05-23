import React, { useState, useRef, useEffect } from "react";
import Button from "./Button";
import Modal from "react-modal";
import uuid from "react-uuid";
import { useMutation, useQueryClient } from "react-query";
import { postData } from "../api/PostData";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useUser } from "../context/UserContext";
const ProductRatingModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStarIndex, setSelectedStarIndex] = useState(-1);
  const [lastHoveredIndex, setLastHoveredIndex] = useState(-1);
  const [comment, setComment] = useState("");
  const queryClient = useQueryClient();
  const modalRef = useRef(null);
  const { user } = useUser();
  const { productId } = useParams();
  const handleStarClick = () => {
    setSelectedStarIndex(lastHoveredIndex);
  };

  const handleMouseEnter = (index) => {
    setLastHoveredIndex(index);
    setSelectedStarIndex(index);
  };

  const handleMouseLeave = (i) => {
    setSelectedStarIndex(i);
  };
  const clearAll = () => {
    setSelectedStarIndex(-1);
    setComment("");
  };
  const addReviewMutation = useMutation(
    (review) => postData(`customer/product/${productId}`, { review }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["reviews", productId]);
      },
    }
  );
  const handleSubmit = async () => {
    if (comment.trim() === "") {
      toast.error("Kindly Comment To Rate this Product");
      return;
    }
    setIsModalOpen(false);
    const review = {
      rating: selectedStarIndex + 1,
      comment: comment.trim(),
    };

    const data = await addReviewMutation.mutateAsync(review);
    if (data) {
      toast.success("Review Added Successfully");
    }
  };
  return (
    <div className="flex flex-1  flex-col   ">
      <div className="header flex items-center justify-around py-3">
        <p className="text-slate-300 font-semibold">
          <span className="text-3xl font-bold text-white ">4.5</span> /5
        </p>
        <div>
          <i className="fa-regular fa-star"></i>
          <i className="fa-regular fa-star"></i>
          <i className="fa-regular fa-star"></i>
          <i className="fa-regular fa-star"></i>
          <i className="fa-regular fa-star"></i>
        </div>
        <div className="text-slate-300 text-xl font-normal">
          6548 ratings and 567 reviews
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className={"bg-blue-500 px-3 py-2 rounded-full"}
          title={"Rate this product"}
        />
      </div>
      <div className="flex justify-center w-full flex-1 relative top-20">
        <Modal
          ref={modalRef}
          style={{
            overlay: {
              background: "#00000077",
            },
            content: {
              background: "#1E293B",
              border: "2px solid #334155",
              width: "90%",
              height: "20rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              top: "40%",
              left: "20px",
              margin: "auto",
              color: "white",
            },
          }}
          isOpen={isModalOpen}
          onRequestClose={(e) => setIsModalOpen(false)}
        >
          <div className="flex items-center justify-between">
            <p className="font-semibold text-lg text-slate-200">Your Rating</p>
            <p
              onClick={clearAll}
              className="font-semibold text-sm  cursor-pointer hover:text-indigo-500 transition-all underline text-indigo-400"
            >
              Clear
            </p>
          </div>
          <div className="flex items-center space-x-3 my-2">
            {[...Array(5)].map((_, i) => (
              <i
                onMouseEnter={() => handleMouseEnter(i)}
                onMouseLeave={() => handleMouseLeave(i)}
                onClick={() => handleStarClick(i)}
                key={i}
                className={`cursor-pointer text-lg ${
                  i <= selectedStarIndex
                    ? "fa-solid fa-star text-yellow-500"
                    : "fa-regular fa-star"
                }`}
              ></i>
            ))}
          </div>
          <p className="font-semibold text-lg text-slate-200">Your Review</p>
          <textarea
            rows={6}
            value={comment}
            placeholder="Add a review..."
            onChange={(event) => setComment(event.target.value)}
            className="w-full my-2 h-32 border-2 border-slate-600 rounded p-2 bg-gray-700 focus:outline-none focus:ring-2 focus:border-transparent focus:ring-indigo-500 resize-none  bg-gray-800/75 text-slate-200 font-medium"
          />
          <button
            type="submit"
            onClick={handleSubmit}
            className="bg-indigo-600 hover:bg-indigo-700 transition duration-150 ease-in-out rounded-full py-2 px-4 mt-4  focus:ring-indigo-500 focus:ring-offset"
          >
            Submit
          </button>
        </Modal>
      </div>
    </div>
  );
};

export default ProductRatingModal;
