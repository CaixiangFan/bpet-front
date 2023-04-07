import React, { useState, useEffect } from "react";
// import { 
//   usePrepareContractWrite, 
//   useContractWrite, 
//   useWaitForTransaction,
//   useNetwork,
//   useAccount 
// } from 'wagmi';
import {
  MdElectricCar,
  MdLocalOffer,
  MdAttachMoney,
  MdOutlineElectricBolt,
  MdAvTimer,
  MdAccountCircle
} from "react-icons/md";
import {
  Avatar,
  Button,
  Select,
  MenuItem,
  FormControl,
  FormControlLabel,
  InputLabel,
  TextField,
  CssBaseline,
  Container,
  Typography,
  Checkbox,
  Grid,
  Stack,
  Box,
  styled,
  Paper
} from '@mui/material';
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { GiPathDistance } from "react-icons/gi";
import { BiCurrentLocation } from "react-icons/bi";
// import ABI from "../../../src/abi.json";
// import useDebounce from "../../../utils/useDebounce";

function Bids(props) {
  const [isopen, setIsopen] = useState(false);
  // const account = useAccount();
  // const {chain, chains} = useNetwork();
  // const debouncedOfferid = useDebounce(props.id, 500);

  function totalCalc(price, amount) {
    return amount * price ;
  }

  // const contractAddress = process.env.NEXT_PUBLIC_MARKET_CONTRACT_ADDRESS;
  // const { config: configConfirm, error: errorConfirm } = usePrepareContractWrite({
  //   address: contractAddress,
  //   abi: ABI,
  //   chainId: chain.id,
  //   functionName: 'completeOffer',
  //   args: [debouncedOfferid],
  //   enabled: Boolean(debouncedOfferid),
  // });


  // const { data: dataConfirm, write: writeConfirm, isError: isConfirmError } = useContractWrite(configConfirm);
  // console.log({configConfirm});
  // console.log({errorConfirm});
  // const { isLoading: isConfirmLoading, isSuccess: isConfirmSuccess } = useWaitForTransaction({
  // hash: dataConfirm?.hash,
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
  //     case "cancelSuccessPolybase":
  //       toast.success("Canceled on Polybase!", {
  //         ...notifyObj,
  //         theme: "light",
  //       });
  //       break;
  //     case "confirmSuccessPolybase":
  //       toast.success("Confirmed on Polybase!", {
  //         ...notifyObj,
  //         theme: "light",
  //       });
  //       break;
  //     case "confirmSuccessChain":
  //       toast.success("Confirmed on chain!", {
  //         ...notifyObj,
  //         theme: "light",
  //       });
  //       break;
  //     case "offerAlreadyConfirmed":
  //       toast.error("Offer already confirmed!", notifyObj);
  //       break;
  //     case "cancelSuccessChain":
  //       toast.success("Deleted offer on-chain!", {
  //         ...notifyObj,
  //         theme: "light",
  //       });
  //       break;
  //   }
  // };

  const handleCancelOffer = async ()=> {
    console.log("Calcel clicked!");
    // const currentTime = new Date().getTime();
    // const offerCancelObj = {
    //   offerID: props.id,
    //   userAccount: account.address,
    //   amount: props.amount,
    //   price: props.price,
    //   location: props.address,
    //   updateTime: currentTime,
    // };
    // console.log(offerCancelObj);
    // const response = await fetch("/api/canceloffer", {
    //   method: "POST",
    //   mode: "cors",
    //   cache: "no-cache",
    //   headers: {
    //     "Content-Type": "application/json",
    //     "Access-Control-Allow-Origin": "*",
    //   },
    //   body: JSON.stringify(offerCancelObj),
    // });
  
    // if (response.status == 201) {
    //   notify("cancelSuccessPolybase");
    // } else if (response.status == 404) {
    //   notify("notFound");
    // }
  }

  useEffect(() => {
      // if (isConfirmSuccess) {
      //   handleConfirmOffer();
      // }
    }
  );

  // const handleConfirmOffer = async ()=> {
  //   const currentTime = new Date().getTime();
  //   const offerConfirmObj = {
  //     offerID: props.id,
  //     userAccount: account.address,
  //     amount: props.amount,
  //     price: props.price,
  //     location: props.address,
  //     updateTime: currentTime,
  //   };
  //   console.log(offerConfirmObj);
  //   const response = await fetch("/api/completeOffer", {
  //     method: "POST",
  //     mode: "cors",
  //     cache: "no-cache",
  //     headers: {
  //       "Content-Type": "application/json",
  //       "Access-Control-Allow-Origin": "*",
  //     },
  //     body: JSON.stringify(offerConfirmObj),
  //   });
  
  //   if (response.status == 201) {
  //     notify("confirmSuccessPolybase");
  //   } else if (response.status == 400){
  //     notify("offerAlreadyConfirmed");
  //   } else if (response.status == 404) {
  //     notify("notFound");
  //   }
  // }

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    // color: theme.palette.text.secondary,
  }));

  return (
    <div>
      {!isopen && (
        <Grid
          container
          onClick={() => setIsopen(!isopen)}
          sx = {{display: 'flex', flexDirection: 'row'}}
        >
          <Grid item sx = {{display: 'flex', flexDirection: 'row'}}>
            <Item sx = {{display: 'flex', flexDirection: 'row', width: 400}}>
            <p>
              <MdOutlineElectricBolt style ={{color: 'blue', fontSize: 18 }} />
              Amount : ~{props.amount} MWh
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              ${props.price.toFixed(2)} / MWh
              <BsChevronDown style ={{color: 'blue', fontSize: 20 }} />
            </p>
            </Item>
          </Grid>
        </Grid>
      )}
      {isopen && (
        <Grid container 
        direction="column"
        justifyContent="center"
        alignItems="stretch"
        >
          <Grid item>
            <Paper
              sx={{
                p: 1,
                width: 1,
                backgroundColor: (theme) =>
                  theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
              }}
            >
              <p onClick={() => setIsopen(!isopen)}>
                <MdLocalOffer style ={{color: 'blue', fontSize: 18 }}  />
                <u>BidID :</u>{` ${props.account.substr(0, 8)}...${props.account.substr(-8)}-${props.id}`}
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <BsChevronUp style={{color: 'blue', fontSize: 20}} />
              </p>

              <p> 
                <MdAttachMoney style ={{color: 'blue', fontSize: 18 }}  />

                <u>Price Rate :</u>
                {` \$${props.price} per MWh`} 
              </p>

              <p>
                <MdOutlineElectricBolt style ={{color: 'blue', fontSize: 18 }}  />
                <u>Max Amount :</u> 
                  {` ${props.amount} MWh`}
              </p>

              <p>
                <MdAvTimer style ={{color: 'blue', fontSize: 18 }}  />
                <u>SubmitAt :</u>  {new Date(props.submitAt * 1000).toLocaleString()}
              </p>

              <p>
                <MdAccountCircle style ={{color: 'blue', fontSize: 18 }}  />
                  <u>Account :</u> {`${props.account.substr(0, 8)}...${props.account.substr(-8)}`}
              </p>

              <p className="text-xl font-bold flex ">
                <u>MaxTotalPay :</u> {` ${totalCalc(props.price, props.amount).toFixed(2)} USD`} 
                <Box 
                  m={1}
                  //margin
                  display="flex"
                  justifyContent="flex-end"
                  alignItems="flex-end"
                >
                  <Button 
                    variant="contained"
                    onClick={() => {console.log("Pay this bid!")}}
                  >
                    Pay
                  </Button>
                </Box>
              </p>
            </Paper>
          </Grid>
        </Grid>
      )}
    </div>
  );
}

export default Bids;