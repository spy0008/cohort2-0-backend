import { useState } from "react";
import { useBank } from "../../../../auth/hook/useBank";
import toast from "react-hot-toast";

const BankModal = ({ onClose }) => {
  const { updateBank } = useBank();

  const [form, setForm] = useState({
    accountNumber: "",
    ifsc: "",
    accountHolderName: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!form.accountNumber || form.accountNumber.length < 9) {
      newErrors.accountNumber = "Valid account number required";
    }

    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(form.ifsc)) {
      newErrors.ifsc = "Invalid IFSC (e.g. HDFC0001234)";
    }

    if (!form.accountHolderName || form.accountHolderName.length < 3) {
      newErrors.accountHolderName = "Name too short";
    }

    setErrors(newErrors);
    setLoading(false);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (!validate()) return;

    try {
      await updateBank(form);
      toast.success("Bank linked successfully ✅");
      onClose(true);
    } catch (err) {
      toast.error(err?.message || err?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 h-screen backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white w-100 rounded-2xl shadow-xl p-6 space-y-5 animate-[fadeIn_.2s_ease]">
        <h2 className="text-2xl font-semibold text-center">Add Bank Details</h2>

        <div>
          <input
            type="text"
            placeholder="Account Number"
            value={form.accountNumber}
            onChange={(e) =>
              setForm({ ...form, accountNumber: e.target.value })
            }
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black"
          />
          {errors.accountNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.accountNumber}</p>
          )}
        </div>

        <div>
          <input
            type="text"
            placeholder="IFSC Code"
            value={form.ifsc}
            onChange={(e) =>
              setForm({ ...form, ifsc: e.target.value.toUpperCase() })
            }
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black"
          />
          {errors.ifsc && (
            <p className="text-red-500 text-sm mt-1">{errors.ifsc}</p>
          )}
        </div>

        <div>
          <input
            type="text"
            placeholder="Account Holder Name"
            value={form.accountHolderName}
            onChange={(e) =>
              setForm({ ...form, accountHolderName: e.target.value })
            }
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black"
          />
          {errors.accountHolderName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.accountHolderName}
            </p>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="w-full border py-2 rounded-lg hover:bg-gray-100 cursor-pointer transition"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-orange-500 text-white py-2 rounded-lg hover:opacity-90 cursor-pointer transition disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BankModal;
