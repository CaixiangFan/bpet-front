import React, { useContext, useState, useEffect } from 'react';
import Layout from 'components/layout';
import { ethers } from "ethers";
import Offers from "../components/pay/Offers";
import Bids from "../components/pay/Bids";
import PaymentIcon from '@mui/icons-material/Payment';
import {
  TOKEN_CONTRACT_ADDRESS
} from 'utils/utils';
import { POOLMARKET_CONTRACT_ADDRESS, backendUrl } from 'utils/utils';
import poolmarketAbi from 'utils/contracts/PoolMarket.sol/PoolMarket.json'
import tokenAbi from 'utils/contracts/EnergyToken.sol/EnergyToken.json'
import { useSnackbar, closeSnackbar } from 'notistack';
import { Store } from "utils/Store";
import {
    Avatar,
    Button,
    CssBaseline,
    Container,
    Typography,
    Stack,
    Box,
  } from '@mui/material';
import axios from 'axios';

const Pay = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { state, dispatch } = useContext(Store);
  const { walletConencted, correctNetworkConnected, account, provider, signer } = state;
  const poolmarketContract = new ethers.Contract(POOLMARKET_CONTRACT_ADDRESS, poolmarketAbi.abi, signer);
  const [usertype, setUsertype] = useState('');
  const [assetId, setAssetId] = useState('');
  const [etkBalance, setETKBalance] = useState(0);
  const [allowance, setAllowance] = useState(0);
  const [actionType, setActionType] = useState('buyETK');
  const [isRegisteredSupplier, setIsRegisteredSupplier] = useState(false);
  const [isRegisteredConsumer, setIsRegisteredConsumer] = useState(false);
  const [agreedCondition, setAgreedCondition] = useState(true);

  const [page, setPage] = useState("bids");
  const [offers, setOffers] = useState([]);
  const [bids, setBids] = useState([]);

  useEffect(() => {
    if (account.length === 0) return
    const checkRegistered = async () => {
      const resIsRegisteredSupplier = await axios.get(`/api/registry/isregisteredsupplier/${account}`);
      const resIsRegisteredConsumer = await axios.get(`/api/registry/isregisteredconsumer/${account}`);
      const _isRegisteredSupplier = resIsRegisteredSupplier.data;
      const _isRegisteredConsumer = resIsRegisteredConsumer.data;
      if (_isRegisteredSupplier) {
        const resRegisteredSupplier = await axios.get(`/api/registry/getsupplier/${account}`);
        const registeredSupplier = resRegisteredSupplier.data;
        setAssetId(registeredSupplier.assetId);
        setUsertype("Supplier");
      } else if (_isRegisteredConsumer) {
        const resRegisteredConsumer = await axios.get(`/api/registry/getconsumer/${account}`);
        const registeredConsumer = resRegisteredConsumer.data;
        setAssetId(registeredConsumer.assetId);
        setUsertype("Consumer");
      } 
      // else {
      //   const resRegisteredSupplier = await axios.get(`/api/registry/getsupplier/${account}`);
      //   const registeredSupplier = resRegisteredSupplier.data;
      //   enqueueSnackbar('This account has not been registered!', { variant: 'info', preventDuplicate: true });
      // }
      setIsRegisteredSupplier(_isRegisteredSupplier);
      setIsRegisteredConsumer(_isRegisteredConsumer);
      const resEtkBalance = await axios.get(`/api/etk/balance/${account}`);
      const balance = resEtkBalance.data;
      setETKBalance(balance);

      const ownerAddressRes = await axios.get(`/api/etk/getOwnerAddress`);
      const allowanceRes = await axios.get(`/api/etk/allowance/${ownerAddressRes.data}/${account}`);
      const allowance = allowanceRes.data;
      setAllowance(allowance);
    }

    checkRegistered();
    const getBids = async () => {
      const bidHours = await poolmarketContract.getBidHours();
      console.log({bidHours});
      const bidsResponse = await axios.get(`/api/poolmarket/getMyBids/${account}/${bidHours}`);
      console.log('My Bids: ', bidsResponse.data);
      if (bidsResponse.data.length > 0) setBids(bidsResponse.data);
    }
    getBids();

    const getOffers = async () => {
      const offersResponse = await axios.get(`/api/poolmarket/getOffers`);
      console.log('Offers: ', offersResponse.data);
      if (offersResponse.data.length > 0) setOffers(offersResponse.data);
    }
  
    getOffers();

  }, [account])
  
  const handleActionTypeChange = (event) => {
    setActionType(event.target.value);
  }

  const inputValidate = (etkData) => {
    let allValid = true;
    if (etkData.actionType.length === 0) {
      allValid = false;
      enqueueSnackbar('You must select an action type', { variant: 'error' })
    }

    if (etkData.amount <= 0) {
      allValid = false;
      enqueueSnackbar('You must input a positive amount', { variant: 'error' })
    }
    return allValid;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const etkData = {
      balance: data.get('balance'),
      usertype: usertype,
      assetID: data.get('assetID'),
      actionType: actionType,
      amount: Number(data.get('amount'))
    };
    const valid = inputValidate(etkData);
    if (!valid) return;

    if (!walletConencted || !signer) {
      enqueueSnackbar("You must login Metamask to continue", { variant: 'info', preventDuplicate: true});
      return
    }

    if (actionType === 'buyETK') {
      const buyToken = async (amount) => {
        await buyETK(amount);
        const resEtkBalance = await axios.get(`/api/etk/balance/${account}`);
        const _etkBalance = resEtkBalance.data;
        setETKBalance(_etkBalance);
        setAllowance(allowance - amount);
      }
      buyToken(etkData.amount);
    }

    if (actionType === 'redeemETK') {
      const redeemToken = async (amount) => {
        await redeemETK(amount);
        const resEtkBalance = await axios.get(`/api/etk/balance/${account}`);
        const _etkBalance = resEtkBalance.data;
        setETKBalance(_etkBalance);
      }
      redeemToken(etkData.amount);
    }

  };

  const buyETK = async (amount) => {
    try {
      const ownerAddressRes = await axios.get(`/api/etk/getOwnerAddress`);
      const ownerAddress = ownerAddressRes.data;
      const tokenContractWrite = new ethers.Contract(TOKEN_CONTRACT_ADDRESS, tokenAbi.abi, signer);
      // Confirm receiving amount of fiat money from user before transfer the ETK
      const tx = await tokenContractWrite.transferFrom(ownerAddress, account, amount);
      const receipt = await tx.wait(1);
      if (receipt.status == 1) {
        enqueueSnackbar("You bought tokens successfully!", { variant: 'success', preventDuplicate: true});
      }
    } catch (err) {
      console.log(err);
    }
  }

  const redeemETK = async (amount) => {
    try{
      const ownerAddressRes = await axios.get(`/api/etk/getOwnerAddress`);
      const ownerAddress = ownerAddressRes.data;
      const tokenContractWrite = new ethers.Contract(TOKEN_CONTRACT_ADDRESS, tokenAbi.abi, signer);
      const tx = await tokenContractWrite.transfer(ownerAddress, amount);
      const receipt = await tx.wait(1);
      if (receipt.status == 1) {
        enqueueSnackbar("You burned tokens successfully!", { variant: 'success', preventDuplicate: true});
      }
      // Transfer amount of fiat money to user's account before burning the ETK
    } catch (err) {
      console.log(err);
    }
  }

  const handleAgreedCondition = () => {
    setAgreedCondition(!agreedCondition);
  }

  return <Layout title='PayETK'>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <PaymentIcon />
          </Avatar>
          
          <Typography component="h1" variant="h5">
            Transactions History
          </Typography>
          
          <Box component="span" sx={{ width: 450, p: 2, display: 'flex'}}>
            <div className=" mt-[1rem] 2xl:mt-[6rem] w-[550px] font-epilogue bg-[#0D111C] border-[1px] border-[#1b2133] p-4 rounded-[15px]">
              <Stack spacing={0} direction="row">
                    <Button
                      variant={page == "bids" ? "outlined" : "text"}
                      style={{maxWidth: '200px', maxHeight: '50px', minWidth: '200px', minHeight: '50px'}}
                      onClick={() => setPage("bids")}
                      sx={{textTransform: 'none'}}
                    >
                      <b>{`Submitted Bids ${bids.length > 0 ? bids.length : 0}`}</b>
                    </Button>
                    
                    <Button
                      style={{maxWidth: '200px', maxHeight: '50px', minWidth: '200px', minHeight: '50px'}}
                      variant={page == "offers" ? "outlined" : "text"}
                      onClick={() => setPage("offers")}
                      sx={{textTransform: 'none'}}
                    >
                      <b>{`Valid Offers ${offers.length > 0 ? offers.length : 0}`}</b>
                    </Button>
              </Stack>
              {offers == "" && page == "offers" && (
                <div className="p-2 px-4 flex justify-center bg-[#0f1421] mt-6 py-8 rounded-[10px] border-[1px] border-[#26365A]">
                  <p className="text-sm md:text-lg">There are no offers in the market.</p>
                </div>
              )}
              {bids == "" && page == "bids" && (
                <div className="p-2 px-4 flex justify-center bg-[#0f1421] mt-6 py-8 rounded-[10px] border-[1px] border-[#26365A]">
                  <p className="text-sm md:text-lg">You have not submitted any bids in the current hour.</p>
                </div>
              )}

              {bids &&
                page == "bids" &&
                bids.map((bid, index) => (
                  <Bids
                    key={index}
                    id={index}
                    amount={bid.amount}
                    price={bid.price}
                    submitAt={bid.submitMinute}
                    account={bid.consumerAccount}
                  />
              ))}
                
              {offers &&
                page == "offers" &&
                offers.map((offer, index) => (
                  <Offers
                    key={index}
                    id={offer.id}
                    amount={offer.amount}
                    price={offer.price}
                    submitAt={offer.submitMinute}
                    account={offer.supplierAccount}
                  />
              ))}
            </div>
          </Box>
        </Box>
      </Container>
  </Layout>
}


export default Pay;