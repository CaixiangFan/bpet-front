import React, { useEffect, useState, useContext } from 'react'
// import { useSnackbar } from 'notistack';
// import { SnackbarProvider, enqueueSnackbar } from 'notistack'
import Head from 'next/head';
import TopBar from './topbar';
import styles from './layout.module.css';
// import { Store } from "utils/Store";

const Layout = ({title, children}) => {
  // const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  // const store = useContext(Store);
  // const [loaded, setLoaded] = useState(false);

  return (
    <>
      <Head>
        <title>{title ? `${title} - BPET` : 'BPET' }</title>
        <meta name="viewport"
          content="initial-scale=1, width=device-width" />
      </Head>
      <TopBar />
      <div className={styles.container}>{children}</div>
    </>
  )
}

export default Layout