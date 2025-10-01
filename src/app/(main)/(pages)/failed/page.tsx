const PaymentFailed = () => {
  return (
    <div className="w-full lg:py-28 py-10 flex justify-center items-center">
      <div className="md:w-2/4 rounded-lg h-auto p-10 lg:shadow-[0_0px_20px_1px_rgba(0,0,0,0.3)] text-center space-y-6">
        <div className="flex justify-center">
          <svg
            width="60px"
            fill="#fff"
            height="60px"
            viewBox="0 0 14 14"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g fillRule="evenodd">
              <path d="M0 7a7 7 0 1 1 14 0A7 7 0 0 1 0 7z" />
              <path d="M13 7A6 6 0 1 0 1 7a6 6 0 0 0 12 0z" fill="red" />
              <path d="M7 5.969L5.599 4.568a.29.29 0 0 0-.413.004l-.614.614a.294.294 0 0 0-.004.413L5.968 7l-1.4 1.401a.29.29 0 0 0 .004.413l.614.614c.113.114.3.117.413.004L7 8.032l1.401 1.4a.29.29 0 0 0 .413-.004l.614-.614a.294.294 0 0 0 .004-.413L8.032 7l1.4-1.401a.29.29 0 0 0-.004-.413l-.614-.614a.294.294 0 0 0-.413-.004L7 5.968z" />
            </g>
          </svg>
        </div>

        <div className="space-y-2">
          <h3 className="text-red-500">Payment Failed</h3>
          <p>Please try again</p>
          <p className="font-bold">Thank you!</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
