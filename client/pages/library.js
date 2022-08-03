import * as React from 'react';

import { Typography, Container } from '@mui/material';

import UserBookList from '../components/UserBookList';
import TopBar from '../components/TopBar';

export default function Index() {
	return (
		<>
			<TopBar />
			<Container maxWidth={false} sx={{ marginBottom: 8 }}>
				<Typography variant="h5">Library</Typography>
				<UserBookList />
			</Container>
		</>
	);
}