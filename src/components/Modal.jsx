import React from "react";

const Modal = ({ title }) => {
  return (
    <>
      <button
        className="bg-indigo-600 focus:bg-indigo-700 hover:bg-indigo-700 px-2 py-1 rounded-md text-[13px] mx-auto"
        onClick={() => document.getElementById("my_modal_1").showModal()}
      >
        {title}
      </button>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Hello!</h3>
          <p className="py-4">
            Press ESC key or click the button below to close
          </p>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default Modal;
