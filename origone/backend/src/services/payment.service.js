import Razorpay from "razorpay";
import { config } from "../config/config.js";

export const razorpay = new Razorpay({
  key_id: config.RAZORPAY_KEY_ID,
  key_secret: config.RAZORPAY_KEY_SECRET,
});

// export const createContact = async (user) => {
//   console.log("contacts running");
//   return await razorpay.customers.create({
//     name: user.fullname,
//     email: user.email,
//     contact: user.contact || "9999999999",
//     type: "vendor",
//   });
// };

// export const createFundAccount = async (contactId, bankDetails) => {
//   console.log("fund_account running");
//   return await razorpay.fundAccount.create({
//     contact_id: contactId,
//     account_type: "bank_account",
//     bank_account: {
//       name: bankDetails.accountHolderName,
//       ifsc: bankDetails.ifsc,
//       account_number: bankDetails.accountNumber,
//     },
//   });
// };
