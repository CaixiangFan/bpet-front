import React, { useEffect, useState, useContext } from 'react';
import { useSnackbar } from 'notistack';
import Head from 'next/head';
import TopBar from 'components/topbar';
import { Store } from "utils/Store";
import PoolPrice from 'components/realtime-price';

const Layout = ({title, children}) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { state, dispatch } = useContext(Store);
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <Head>
        <title>{title ? `${title} - BPET` : 'BPET' }</title>
        <meta name="viewport"
          content="initial-scale=1, width=device-width" />
      </Head>
      <TopBar />
      <PoolPrice />
      {children}
    </>
  )
}

export default Layout