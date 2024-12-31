import React from "react";
import { createPortal } from "react-dom";

export default function Modal({ title, children, id, size, triggeredButton, classNameButtonTrigger, classNameTitle }) {
  return (
    <>
      <span className={classNameButtonTrigger || ""} type="button" data-bs-toggle="modal" data-bs-target={`#${id}`}>
        {triggeredButton}
      </span>

      {createPortal(
        <div className="modal fade" id={id} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className={`modal-dialog ${size ? `modal-${size}` : ""}`}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className={`modal-title ${classNameTitle}`} id="exampleModalLabel">
                  {title}
                </h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">{children}</div>
              {/* <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button type="button" className="btn btn-primary">
                Save changes
              </button>
            </div> */}
            </div>
          </div>
        </div>,
        document.querySelector("#root"),
      )}
    </>
  );
}
