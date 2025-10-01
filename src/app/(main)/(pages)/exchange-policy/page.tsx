import React from "react";

const ExchangePolicy = () => {
  return (
    <div className="lg:py-10 md:py-12 mb-20">
      <h3 className="font-bold text-color text-3xl text-center lg:py-12 md:py-12 sm:py-16 py-16">
        Return & Exchange Policy
      </h3>
      <div className="lg:px-28 md:px-28 sm:px-5 px-5 space-y-8 mt-10 text-justify">
        <ul style={{ listStyle: "initial" }}>
          <h3 className="font-bold text-2xl text-color">Return Policy</h3>
          <li className="py-4">
            All “keysaria “ products are made of the finest quality fabrics. Our
            products are carefully crafted by our artisans and go through strict
            quality control before shipping. Considering the confidence in the
            quality of our deliverables, we do not extend the return facility
            for our products. Also, our endeavour is to offer our customers the
            best prices in the market, because of which we have not accommodated
            the return cost involved in the process. Hence, we don&apos;t offer
            return or refunds because of the reasons stated above.
          </li>

          <div className="py-10">
            <h3 className="lg:text-2xl md:text-3xl sm:text-2xl text-color text-2xl font-bold">
              Exchange Policy
            </h3>
            <h5 className="font-semibold ">
              Your purchase is qualified for an exchange only if it meets the
              following conditions:
            </h5>

            <li className="py-2">
              If the item you get has a genuine quality/manufacturing fault.
            </li>
            <li className="py-2">
              If your purchase meets our exchange criteria mentioned above,
              please contact our customer support team on{" "}
              <a
                href="mailto:keysarialabels@gmail.com"
                className="text-color font-semibold"
              >
                keysarialabels@gmail.com
              </a>{" "}
              or call our consumer experience helpline at{" "}
              <a href="tel:+919871870405" className="text-color font-semibold">
                +91 9220478135
              </a>{" "}
              within 24 hours of parcel delivery.
            </li>
            <li className="py-2">
              Our Quality Check team will confirm the manufacturing defects (or
              any other discrepancy), after which our team will email or contact
              you for the essential action.
            </li>
          </div>
          <div className="py-10">
            <h3 className="lg:text-2xl md:text-3xl sm:text-2xl text-color text-2xl font-bold">
              Cancellation Policy
            </h3>
            <div className="py-2 font-semibold">
              If you need to cancel an order it can only be done if the order is
              not shipped, it&apos;s important to act swiftly. Here&apos;s a
              step-by-step guide:
            </div>
            <li className="py-2">
              Check the Time: Verify the time elapsed since you placed the
              order. Ensure it&apos;s within the 24-hour window.
            </li>
            <li className="py-2">
              Review Cancellation Policy: Quickly review the company&apos;s
              cancellation policy. Look for any specific instructions or
              deadlines for cancelling orders within the 24-hour timeframe.
            </li>
            <li className="py-2">
              Locate Order Information: Gather your order number or any other
              relevant details associated with the purchase. This information
              will expedite the cancellation process.
            </li>
            <li className="py-2">
              Contact Customer Support Immediately: Reach out to the
              company&apos;s customer support team as soon as possible. You can
              typically find their contact details on the website or in your
              order confirmation email.
            </li>
            <li className="py-2">
              Provide Necessary Information: When contacting customer support,
              clearly state that you need to cancel your order. Provide your
              order number and any other requested details promptly.
            </li>
            <li className="py-2">
              Follow Instructions: Follow the instructions provided by the
              customer support representative. They may require additional
              information or verification to process the cancellation.
            </li>
            <li className="py-2">
              Verify Cancellation: Once the cancellation process is complete,
              ask for confirmation from the customer support team. Make sure to
              keep a record of this confirmation for your records.
            </li>
            <li className="py-2">
              NOTE: In case of any cancellation for prepaid orders the refund
              against the same will be initiated within 24 to 48 hours{" "}
            </li>
          </div>
        </ul>
      </div>
    </div>
  );
};

export default ExchangePolicy;
