import React, { useState,useEffect } from "react";
// import { 
//   usePrepareContractWrite, 
//   useContractWrite, 
//   useWaitForTransaction,
//   useNetwork,
//   useAccount 
// } from 'wagmi';
import {
  MdElectricCar,
  MdAttachMoney,
  MdOutlineElectricBolt,
} from "react-icons/md";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { BiCurrentLocation } from "react-icons/bi";
// import ABI from "../../../src/abi.json";
// import useDebounce from "../../../utils/useDebounce";

function Offer(props) {
  const [isopen, setIsopen] = useState(false);
  // const account = useAccount();
  // const {chain, chains} = useNetwork();
  // const debouncedOfferid = useDebounce(props.id, 500);

  function totalCalc(price, amount) {
    return amount * price ;
  }
  // const contractAddress = process.env.NEXT_PUBLIC_MARKET_CONTRACT_ADDRESS;
  // const { config, error } = usePrepareContractWrite({
  //   address: contractAddress,
  //   abi: ABI,
  //   chainId: chain.id,
  //   functionName: 'deleteOffer',
  //   args: [debouncedOfferid],
  //   enabled: Boolean(debouncedOfferid),
  // });


  // const { data, write, isError } = useContractWrite(config);
  // console.log({config});
  // console.log({error});
  // const { isLoading, isSuccess } = useWaitForTransaction({
  // hash: data?.hash,
  // }) 

  // const notify = (opt) => {
  //   const notifyObj = {
  //     position: "top-center",
  //     text: "19px",
  //     autoClose: 5000,
  //     hideProgressBar: false,
  //     closeOnClick: true,
  //     pauseOnHover: true,
  //     draggable: true,
  //     progress: undefined,
  //     theme: "dark",
  //   };
  //   switch (opt) {
  //     case "notFound":
  //       toast.error(
  //         "Offer not found !",
  //         notifyObj
  //       );
  //       break;
  //     case "deleteSuccessPolybase":
  //       toast.success("Deleted offer in Polybase!", {
  //         ...notifyObj,
  //         theme: "light",
  //       });
  //       break;
  //     case "deleteSuccessChain":
  //       toast.success("Deleted offer on-chain!", {
  //         ...notifyObj,
  //         theme: "light",
  //       });
  //       break;
  //   }
  // };

  useEffect(() => {
    // if (isSuccess) {
    //   handleDeleteOffer();
    // }
  }
  );


  // const handleDeleteOffer = async () => {
  //   const currentTime = new Date().getTime();
  //   const offerDeleteObj = {
  //     offerID: props.id,
  //     userAccount: account.address,
  //     amount: props.amount,
  //     price: props.price,
  //     location: props.address,
  //     updateTime: currentTime,
  //   };
  //   console.log(offerDeleteObj);
  //   const response = await fetch("/api/deleteoffer", {
  //     method: "POST",
  //     mode: "cors",
  //     cache: "no-cache",
  //     headers: {
  //       "Content-Type": "application/json",
  //       "Access-Control-Allow-Origin": "*",
  //     },
  //     body: JSON.stringify(offerDeleteObj),
  //   });
  
  //   if (response.status == 201) {
  //     notify("deleteSuccessPolybase");
  //   } else if (response.status == 404) {
  //     notify("notFound");
  //   }
  // }

  return (
    <div>
      {!isopen && (
        <div
          onClick={() => setIsopen(!isopen)}
          className="p-2 flex justify-between bg-[#0f1421] rounded-[10px] border-[1px] border-[#26365A] text-[15px] md:text-[18px] font-kanit hover:cursor-pointer mt-3"
        >
          <div className="flex">
            <MdElectricCar className="mt-[4px] text-[24px] mr-1 md:mr-2 text-blue-500" />
            <p className="mr-1 md:mr-2 ">Amount : ~{props.amount} MWH</p>
          </div>
          <div className="flex">
            <p className="mr-1 md:mr-2">${props.price.toFixed(2)} / MWH</p>
            <BsChevronDown className="text-blue-500 text-[24px] mt-[3px]" />
          </div>
        </div>
      )}
      {isopen && (
        <div className="p-2 justify-between bg-[#0f1421] rounded-[10px] border-[1px] border-[#26365A] text-[15px] md:text-[18px] font-kanit hover:cursor-pointer mt-3">
          <div>
            <div
              className="flex justify-between "
              onClick={() => setIsopen(!isopen)}
            >
              <div className="flex">
                <MdElectricCar className="mt-[4px] mr-1 md:mr-2 text-blue-500  text-[24px]" />
                <p className="text-[18px] flex mt-[2px]">
                  <p className="font-bold mr-2 underline">Offer:</p> {props.id}
                </p>
              </div>
              <BsChevronUp className="text-blue-500 mt-[1px]  text-[24px]" />
            </div>
          </div>
          <div className="flex mt-2">
            <MdAttachMoney className="mt-[4px] mr-1 md:mr-2 text-blue-500  text-[24px]" />
            <p className="text-[18px] flex mt-[2px]">
              <p className="font-bold mr-2 underline">Price Rate:</p> $
              {props.price} per MWH
            </p>
          </div>
          <div className="flex mt-2">
            <MdOutlineElectricBolt className="mt-[4px] mr-1 md:mr-2 text-blue-500  text-[24px]" />
            <p className="text-[18px] flex mt-[2px]">
              <p className="font-bold mr-2 underline">Max Amount:</p>
              {props.amount} MWH
            </p>
          </div>
          <div className="flex mt-2">
            <BiCurrentLocation className="mt-[4px] mr-1 md:mr-2 text-blue-500  text-[24px]" />
            <p className="text-[18px] flex mt-[2px]">
              <p className="font-bold mr-2 underline">Location:</p>{" "}
            </p>
          </div>
          <p className="mt-2 ml-2 truncate">{props.address}</p>
          <div className="flex justify-between px-1 mt-4">
            <div className="flex mt-2">
              <p className="text-xl font-bold flex ">Total:</p>
              <p className="text-xl font-bold text-blue-500 ml-2 ">
                {totalCalc(props.price, props.amount).toFixed(2)} USD
              </p>
            </div>
          </div>
          <div className="flex justify-between mt-4 mx-2">
            <div className=""></div>
            <div 
              // disable={!write}
              onClick={() => {console.log("Delete!")}}
              className="p-2  bg-red-600 text-white  rounded-[10px] mb-1">
              Delete Listing
            </div>
          </div>
          {/* <div>
            {isSuccess && (
              <div>
                {notify("deleteSuccessChain")}
                Successfully deleted !
                <a 
                  href={`${chain.blockExplorers.etherscan.url}tx/${data?.hash}` } 
                  target="_blank"
                  className=" text-[#5285F6] mt-2 md:mt-2"
                  > Explore TX</a>
              </div>  
            )}
          </div> */}
        </div>
      )}
    </div>
  );
}

export default Offer;