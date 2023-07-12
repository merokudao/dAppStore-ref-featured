import React, { useContext, useState, useEffect } from "react";
import { useWeb3AuthContext } from "./SocialLoginContext";
import { useSmartAccountContext } from "./SmartAccountContext";
import { ethers } from "ethers";
import abi from "../utils/abi.json";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Review } from "../features/dapp/models/review";

const contractAddress = "0x83994FCde3272d4c35c193417828788eE437553e";

export const ReviewContext = React.createContext({
  reviews: [],
  contractAddress: "",
  getReviews: (id: string) => {},
  txurl: "",
  average: 0,
  provider: undefined,
  reviewCount: 0,
  toastState: "",
  createReview: (
    dappId: string,
    rating: number,
    comment: string | undefined
  ) => {},
});

export const ReviewProvider = ({ children }) => {
  const [reviews, setReviews] = useState([]);
  const [average, setAverage] = useState(0);
  const [toastState, setToastState] = useState("");
  const [txurl, setTxUrl] = useState("");
  const [reviewCount, setReviewCount] = useState(0);
  const { provider } = useWeb3AuthContext();
  const { wallet } = useSmartAccountContext();

  let smartAccount = wallet;

  function combineArrays(arr1, arr2) {
    if (arr1.length !== arr2.length) {
      throw new Error("Both input arrays should have the same length");
    }

    let result = [];
    for (let i = 0; i < arr1.length; i++) {
      // @ts-ignore
      result.push({ rating: arr1[i], content: arr2[i] });
    }
    return result;
  }

  function averageRating(arr) {
    if (arr.length === 0) {
      throw new Error("The input array should not be empty");
    }

    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
      sum += arr[i].rating;
    }
    return Math.round(sum / arr.length);
  }

  const getReviews = async (page: string) => {
    if (!provider) {
      console.log("no provider");
      return;
    }
    const web3Provider = new ethers.providers.Web3Provider(provider);
    const contract = new ethers.Contract(contractAddress, abi, web3Provider);
    const currentReviews = await contract.getAllReviews(page);
    const formattedReviews = combineArrays(
      currentReviews[0],
      currentReviews[1]
    );
    setReviews(formattedReviews);
    setReviewCount(formattedReviews.length);
    setAverage(averageRating(formattedReviews));
  };

  const createReview = async (dapp, raiting, content) => {
    const web3Provider = new ethers.providers.Web3Provider(provider);
    try {
      toast.info("Adding review on chain...", {
        position: "top-right",
        autoClose: 15000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      const reviewContract = new ethers.Contract(
        contractAddress,
        abi,
        web3Provider
      );
      const reviewTx = await reviewContract.populateTransaction.addReview(
        dapp,
        raiting,
        content
      );
      const tx = {
        to: contractAddress,
        data: reviewTx.data,
      };
      const txResponse = await smartAccount?.sendTransaction({
        transaction: tx,
      });
      console.log({ txResponse });
      const txHash = await txResponse?.wait();
      console.log({ txHash });
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success(
        <a
          href={`https://mumbai.polygonscan.com/tx/${txHash?.transactionHash}`}
          target="_blank"
          rel="noreferrer"
        >
          Success! Click here for your transaction!
        </a>,
        {
          position: "top-right",
          autoClose: 15000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        }
      );
      getReviews(dapp);
    } catch (error) {
      console.error(error);
      toast.error("An error occured check the console", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  return (
    <ReviewContext.Provider
      value={{
        reviews,
        contractAddress,
        getReviews,
        provider,
        average,
        reviewCount,
        createReview,
        txurl,
        toastState,
      }}
    >
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      {children}
    </ReviewContext.Provider>
  );
};

export const useReviewContext = () => useContext(ReviewContext);
