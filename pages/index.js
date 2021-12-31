import React from 'react';

import { Typography, Container } from '@mui/material';

import StoreBookList from '../components/StoreBookList';
import TopBar from '../components/TopBar';

export default function Index() {
  return (
    <>
      <TopBar />
      <Container maxWidth={false} sx={{ marginBottom: 8 }}>
        <Typography variant="h5">Store</Typography>
        <StoreBookList />
      </Container>
    </>
  );
}