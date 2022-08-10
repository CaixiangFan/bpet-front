import React, { useContext, useState, useEffect } from 'react'
// import axios from 'axios';
// import { Typography, Box, Paper, Button, TextField, InputLabel, MenuItem, FormControl, Select, CircularProgress } from '@mui/material';
// import { useRouter } from 'next/router'
// import { useSnackbar } from 'notistack';
import Layout from 'components/layout'
// import { Store } from "utils/Store";
// import { ethers } from 'ethers';
// import { contractAddress, defaultProvider, contractRead, backendUrl } from "utils/const"
// import abi from 'utils/contracts/abi.json'

const Admin = () => {
  // const router = useRouter()
  // const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  // const { state, dispatch } = useContext(Store);
  // const { adminAddress, walletConencted, correctNetworkConnected, account, provider, signer, ticketCategories } = state;

  // const [loaded, setLoaded] = useState(false);
  // const [adminConnected, setAdminConnected] = useState(false);
  // // SET UP NEW TICKET
  // const [newName, setNewName] = useState('')
  // const [newTicketPrice, setNetTicketPrice] = useState('')
  // const [newMaxNumOfTicket, setNewMaxNumOfTicket] = useState(0)

  // const onNameChangeHandler = (e) => {
  //   setNewName(e.target.value)
  // }

  // const onTicketPriceChangeHandler = (e) => {
  //   setNetTicketPrice(e.target.value)
  // }

  // const onMaxNumTicketChangeHandler = (e) => {
  //   setNewMaxNumOfTicket(e.target.value)
  // }

  // const onCreateTicketHandler = (e) => {
  //   const create = async () => {
  //     try {
  //       const _name = ethers.utils.formatBytes32String(newName)
  //       const _price = ethers.utils.parseEther(newTicketPrice)
  //       const _maxNumber = parseInt(newMaxNumOfTicket)
  //       const contractWrite = new ethers.Contract(contractAddress, abi, signer)
  //       await contractWrite.setUpTicket(_name, _price, _maxNumber, 0)
  //       enqueueSnackbar("Ticket Creation Submitted", { variant: "info" })
  //     }
  //     catch (error) {
  //       enqueueSnackbar("Create Ticket Error:", error)
  //     }
  //   }
  //   create()
  // }


  // useEffect(() => {
  //   if (adminAddress.length === 0 || account.length == 0) {
  //     setLoaded(false)
  //     setAdminConnected(false)
  //   }
  //   if (adminAddress === account) {
  //     closeSnackbar()
  //     enqueueSnackbar('Welcome to the admin dashboard', { variant: 'success' })
  //     setAdminConnected(true)
  //   } else {
  //     closeSnackbar()
  //     enqueueSnackbar('Sorry, you are not admin of the contract', { variant: 'error' })
  //     setAdminConnected(false)
  //   }
  // }, [account, adminAddress])

  return (
    <Layout title="Admin">
      <h1>This is Admin page!</h1>
    </Layout>
  )
}

export default Admin