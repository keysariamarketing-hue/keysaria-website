import { useState } from "react";
import { Modal, Radio } from "antd";
import { ModeOfPayment } from "@/types/enums";

// Define the prop types
interface OrderCheckoutModalProps {
  isVisible: boolean;
  onClose: () => void;
  onProceed: (paymentMethod: ModeOfPayment) => void;
}

const OrderCheckoutModal: React.FC<OrderCheckoutModalProps> = ({
  isVisible,
  onClose,
  onProceed,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<ModeOfPayment>(
    ModeOfPayment.PREPAID
  );

  return (
    <Modal
      centered
      open={isVisible}
      onCancel={onClose}
      footer={null}
      width={500}
    >
      {/* Modal Header */}
      <h3 className="text-xl font-semibold text-center">Payment</h3>
      <p className="text-sm text-gray-500 text-center">
        All transactions are secure and encrypted.
      </p>

      {/* Payment Options */}
      <div className="mt-4 border rounded-lg p-4">
        <Radio.Group
          onChange={(e) => setPaymentMethod(e.target.value)}
          value={paymentMethod}
          className="w-full"
        >
          {/* Razorpay Option */}
          <div className="border p-3 rounded-lg mb-3 cursor-pointer">
            <Radio value={ModeOfPayment.PREPAID}>
              <span className="font-semibold">Razorpay Secure</span>
              <span className="text-gray-500 text-sm ml-2">
                (UPI, Cards, Wallets, NetBanking)
              </span>
            </Radio>
            <p className="text-xs text-gray-500 mt-2">
              After clicking Pay now, you will be redirected to Razorpay Secure.
            </p>
          </div>

          {/* Cash on Delivery Option */}
          <div className="border p-3 rounded-lg cursor-pointer">
            <Radio disabled value={ModeOfPayment.COD}>
              <span className="font-semibold">
                Cash on Delivery (Coming Soon)
              </span>
            </Radio>
          </div>
        </Radio.Group>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end mt-5 gap-3">
        <button
          className="bg-gray-300 px-4 py-2 rounded text-gray-700"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className="bg-black text-white px-4 py-2 rounded"
          onClick={() => onProceed(paymentMethod)}
        >
          Pay Now
        </button>
      </div>
    </Modal>
  );
};

export default OrderCheckoutModal;
