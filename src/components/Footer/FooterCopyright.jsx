import React from "react";
import classes from "./FooterCopyright.module.css";
export default function FooterCopyright({ title, footerClassName }) {
  return (
    <div className={`${classes["footer-copyright"]} ${title === "cart" ? "mt-12" : ""} ${footerClassName}`}>
      <div className="row">
        <div className="col-md-4">
          <div className={`${classes["footer-copyright-item-1"]} ${classes["line-mobile"]}`}>
            <h2>TASTY KITCHEN</h2>
            <p>A place to experience the quintessence of cuisine and take restaurant taste to your home.</p>
            <img src="https://static.tastykitchen.vn/images/bo-cong-thuong.png" alt="logo" />
          </div>
        </div>

        <div className="col-md-6">
          <div className={`${classes["footer-copyright-item-2"]} ${classes["line-mobile"]}`}>
            <h2 className="mb-2">CONTACT US</h2>
            <p className="d-flex flex-col gap-2">
              <span className={`${classes["item-2-FB"]}`}>F&B VIETNAM INVESTMENT AND SERVICE JOINT STOCK COMPANY</span>

              <span>
                Office address: Lorem ipsum dolor, sit amet consectetur adipisicing elit. Harum distinctio adipisci,
                aliquid quis repellat nulla.
              </span>

              <span>Phone: 1900 633 818</span>

              <span>Email: order.tastykitchen@gmail.com</span>
            </p>
          </div>
        </div>
        <div className="col-md-2">
          <div className={`${classes["footer-copyright-item-3"]}`}>
            <h2 className="mb-2">CUSTOMER SUPPORT</h2>
            <ul className="d-flex flex-col gap-2 text-nowrap">
              <li>
                <i className="fa fa-long-arrow-alt-right"></i> Lorem ipsum dolor sit.
              </li>
              <li>
                <i className="fa fa-long-arrow-alt-right"></i> Lorem ipsum dolor sit.
              </li>
              <li>
                <i className="fa fa-long-arrow-alt-right"></i> Lorem ipsum dolor sit.
              </li>
              <li>
                <i className="fa fa-long-arrow-alt-right"></i> Lorem, ipsum dolor.
              </li>
              <li>
                <i className="fa fa-long-arrow-alt-right"></i> Lorem, ipsum dolor.
              </li>
              <li>
                <i className="fa fa-long-arrow-alt-right"></i> Lorem, ipsum dolor.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
