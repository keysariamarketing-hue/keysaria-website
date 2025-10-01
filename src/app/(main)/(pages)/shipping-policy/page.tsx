import React from "react";

const ShippingPolicy = () => {
  return (
    <div className=" mb-20">
      <div className="lg:px-28 md:px-28 sm:px-5 px-5 space-y-8 py-16">
        <h3 className="font-bold text-3xl text-center text-color">
          Shipping Policy
        </h3>
        <ul style={{ listStyle: "initial" }} className="py-4">
          <li className="py-4">
            The terms of Delivery Policy must be understood. If you do not agree
            to the terms contained in this Delivery Policy, you are advised not
            to accept the Terms of Use and the Delivery Policy. The terms
            contained in this Delivery Policy shall be accepted without
            modification and accordingly, to be bound by the terms contained
            herein.
          </li>
          <li className="py-4">
            <span className="text-color font-bold">“Keysaria” </span>
            is committed to deliver all orders with good quality packaging
            within a span of 5 to 7 working days (excluding Sundays & Public
            holidays) under normal circumstances.
          </li>
          <li className="py-4">
            <span className="text-color font-bold">“Keysaria” </span>
            makes all commercially reasonable endeavours to ensure that the
            product(s) are delivered to the end users in a timely fashion. To
            ensure that the order reaches in a good condition, in the shortest
            span of time, we ship through reputed logistics companies.
          </li>
          <div className="w-full text-center py-4">
            <h4 className="text-color font-bold">Domestic Shipping</h4>
          </div>
          <li>
            Congratulations ! we offer free shipping on all the domestic orders
            . Orders are delivered within 5 to 6 working days. Unless otherwise
            specifically mentioned in the product details.
          </li>
          <li className="py-4">
            Delivery of all orders will be duly done to the address as mentioned
            by you at the time of placing the order. In case of modifications,
            kindly drop us a mail at{" "}
            <a
              href="mailto:keysarialabels.gmail.com"
              className="text-color font-bold"
            >
              keysarialabels@gmail.com
            </a>{" "}
            within 2 hours of placing the order.
          </li>
          <li>Our prices are all inclusive of taxes such as GST.</li>
          <li className="py-4">
            <span className="text-color font-bold">“Keysaria” </span> partners
            with third party logistic service providers separate and distinct
            from “The Karagha Tales “, to execute product(s) delivery to the end
            users. Details of the Logistic Partner who will be processing the
            delivery of the order will be provided to the end user through Email
            & SMS along with the tracking
          </li>
          <li>
            Prior to making payments for the purchase of product(s), the user
            will be prompted to provide a shipping address. While entering
            shipping address details, the user should ensure to provide correct,
            complete and accurate information along with landmarks if any to aid
            delivery.
            <span className="text-color font-bold">“Keysaria” </span>
            shall not, under any circumstance, be liable for any failure in
            delivery of the purchased product(s) arising out of the user&apos;s
            failure to provide correct, complete and/or accurate, information.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ShippingPolicy;
