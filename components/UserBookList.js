import React, { useEffect, useState } from 'react';
import BigNumber from "bignumber.js";

import {
  Box,
  Typography,
  Button
} from '@mui/material';

import { useContractState, ERC20_DECIMALS } from './ContractProvider';
import Link from './Link';

export default function UserBookList() {

  const [bookList, setBookList] = useState([]);

  const contractState = useContractState();

  let books = [];

  useEffect(() => {
    if (contractState.contract) {
      getBooks();
    } else {
      setBookList([]);
    }
  }, [contractState.contract]);

  const getBooks = async function () {
    const _productsList = await contractState.contract.methods.getUserBooks().call({ from: contractState.account });

    const _productsLength = _productsList.length;
    const _products = []
    for (let i = 0; i < _productsLength; i++) {
      let _product = new Promise(async (resolve, reject) => {
        let p = await contractState.contract.methods.getBookPublicDetails(_productsList[i]).call()
        resolve({
          index: p[0],
          coverUrl: p[1],
          title: p[2],
          author: p[3],
          price: new BigNumber(p[4]).shiftedBy(-ERC20_DECIMALS).toFixed(2),
          sold: p[5],
        })
      })
      _products.push(_product)
    }

    books = await Promise.all(_products);

    setBookList(books);
  }

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, 160px)', gridGap: '32px', justifyContent: 'space-between', marginTop: 2 }}>
      {bookList.map(book => {
        return (
          <Box key={book.index} sx={{ width: '160px' }}>
            <img
              src={book.coverUrl}
              alt={`${book.author} - ${book.title}`}
              loading="lazy"
              width="160"
              height="240"
            />
            <Box title={`${book.author} - ${book.title}`}>
              <Typography variant="subtitle1" sx={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{book.title}</Typography>
              <Typography variant="subtitle2" sx={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{book.author}</Typography>
              <Button
                  variant="outlined"
                  component={Link}
                  size="small"
                  fullWidth
                  sx={{ lineHeight: "inherit", padding: "2px 0", marginTop: 1, textTransform: 'none' }}
                  href={`/book/${book.index}`}
                >
                  Read book
                </Button>
            </Box>
          </Box>
        )
      })}
    </Box>
  )
}
