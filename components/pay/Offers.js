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

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    // color: theme.palette.text.secondary,
  }));

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
        <Grid
          container
          onClick={() => setIsopen(!isopen)}
        >
          <Grid item sx = {{display: 'flex', flexDirection: 'row'}} xs = {12}>
            <Item sx = {{display: 'flex', flexDirection: 'row',  width: 400}}>
              <Grid container sx={{width: 1/2}}>

                <Typography inline variant="body1" align="left">
                  <MdOutlineElectricBolt style ={{color: 'blue', fontSize: 18 }} />
                  Amount : ~{props.amount} MWh 
                </Typography>
              </Grid>
              <Grid container sx={{width: 1/2}}>

                <Typography inline variant="body1" align="right">
                  {` ${props.price.toFixed(2)} / MWh`}
                  <BsChevronDown style ={{color: 'blue', fontSize: 20 }} />
                </Typography>
              </Grid>
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
                <u>OfferID :</u>{` ${props.id.substr(0, 8)}...${props.id.substr(-8)}`}
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <BsChevronUp style ={{color: 'blue', fontSize: 20 }}  />
              </p>
              <p>
                <MdAttachMoney style ={{color: 'blue', fontSize: 18 }} />
                <u>Price Rate :</u> 
                  {` \$ ${props.price} per MWh`} 
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
                <u>MaxTotalRevenue :</u> {` ${totalCalc(props.price, props.amount).toFixed(2)} USD`}
                <Box 
                  m={1}
                  //margin
                  display="flex"
                  justifyContent="flex-end"
                  alignItems="flex-end"
                >
                  <Button 
                    variant="contained"
                    onClick={() => {console.log("Delete!")}}
                    sx = {{backgroundColor: 'red'}}
                  >
                    Delete
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

export default Offer;