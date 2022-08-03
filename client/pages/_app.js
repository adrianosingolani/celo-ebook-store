import * as React from 'react';
import Head from 'next/head';

import PropTypes from 'prop-types';
import { CacheProvider } from '@emotion/react';
import { ThemeProvider } from '@mui/material/styles';
import createEmotionCache from '../styles/createEmotionCache';
import theme from '../styles/theme';

import { CssBaseline } from '@mui/material';

import ContractProvider from '../components/ContractProvider';
import Notification from '../components/Notification';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export default function MyApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  return (
    <ContractProvider>
      <CacheProvider value={emotionCache}>
        <Head>
          <title>Celo eBook Store</title>
          <meta name="description" content="An eBook store created on Celo blockchain" />
          <link rel="icon" href="/favicon.ico" />
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Notification>
            <Component {...pageProps} />
          </Notification>
        </ThemeProvider>
      </CacheProvider>
    </ContractProvider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};