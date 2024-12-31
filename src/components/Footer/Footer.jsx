import React from "react";
import classes from "./Footer.module.css";
import FooterCopyright from "./FooterCopyright";
export default function Footer() {
  return (
    <div className={`${classes.footer}`}>
      <div className={`${classes["footer-signup"]}`}>
        <div className={`${classes["footer-signup-captions"]}`}>
          <h3>{"Subscribe to our newsletter".toUpperCase()}</h3>
          <p>
            Please enter your email to receive latest information about special promotions and offers from our Kitchen.
          </p>
          <div className={`${classes["footer-signup-inputContainer"]}`}>
            <input
              className="dark:border-gray-600 dark:bg-gray-700 dark:!text-white"
              placeholder="Enter your email address"
              type="email"
            />
            <button className={`${classes["footer-signup-btn"]}`}>Sign up</button>
          </div>
        </div>
      </div>

      <div className={`${classes["footer-utils"]}`}>
        <div className="row justify-content-center text-center">
          <div className="col-md-4">
            <div className={`${classes["footer-utils-item"]}`}>
              <img className="m-auto" src="https://static.tastykitchen.vn/images/pc/icon-support.jpg" alt="" />
              <p>SUPPORT 12/7</p>
              <p>Customer support is always here to help you</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className={`${classes["footer-utils-item"]}`}>
              <img className="m-auto" src="https://static.tastykitchen.vn/images/pc/icon-support.jpg" alt="" />
              <p>CONVENIENT PAYMENTS</p>
              <p>We support online payment via e-wallets</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className={`${classes["footer-utils-item"]}`}>
              <img className="m-auto" src="https://static.tastykitchen.vn/images/pc/icon-support.jpg" alt="" />
              <p>FAST DELIVERY</p>
              <p>The food always remains fresh and hot when it is served to your home.</p>
            </div>
          </div>
        </div>
      </div>

      <FooterCopyright />
    </div>
  );
}
