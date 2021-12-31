import React, { useEffect, useState } from 'react';
import BigNumber from "bignumber.js";

import {
  Box,
  Typography,
  Button
} from '@mui/material';

import { useContractState, useContractDispatch, ERC20_DECIMALS } from './ContractProvider';
import { useNotificationDispatch } from './Notification';
import Link from './Link';

export default function StoreBookList() {

  const [storeBookList, setStoreBookList] = useState([]);
  const [userBookList, setUserBookList] = useState([]);

  const contractState = useContractState();
  const contractDispatch = useContractDispatch();
  const notificationDispatch = useNotificationDispatch();


  let books = [];

  useEffect(() => {
    if (contractState.contract) {
      getStoreBooks();
      getUserBooks();
    } else {
      setStoreBookList([]);
    }
  }, [contractState.contract]);

  const getUserBooks = async function () {
    const userBooks = await contractState.contract.methods.getUserBooks().call({ from: contractState.account });
    setUserBookList(userBooks);
  }

  const getStoreBooks = async function () {
    const _productsLength = await contractState.contract.methods.getBooksTotal().call()
    const _products = []
    for (let i = 0; i < _productsLength; i++) {
      let _product = new Promise(async (resolve, reject) => {
        let p = await contractState.contract.methods.getBookPublicDetails(i).call()
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

    setStoreBookList(books);
  }

  const buyBook = (index) => {
    contractState.contract.methods.buyBook(index).send({ from: contractState.account })
      .then(res => {
        notificationDispatch({
          type: 'SET_NOTIFICATION',
          payload: 'You bought a new book!'
        });

        contractState.kit.getTotalBalance(contractState.account)
          .then((bigBalance) => {
            const balance = bigBalance.cUSD.shiftedBy(-ERC20_DECIMALS).toFixed(2);

            console.log(balance);

            contractDispatch({
              type: 'SET_BALANCE',
              payload: balance
            });
          })
      })
      .catch(err => {
        notificationDispatch({
          type: 'SET_NOTIFICATION',
          payload: 'Something went wrong'
        });
      })
  }

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, 160px)', gridGap: '32px', justifyContent: 'space-between', marginTop: 2 }}>
      {storeBookList.map(book => {
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
              {userBookList.includes(book.index) ? (
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
              ) : (
                <Button
                  variant="outlined"
                  size="small"
                  fullWidth
                  sx={{ lineHeight: "inherit", padding: "2px 0", marginTop: 1, textTransform: 'none' }}
                  onClick={() => buyBook(book.index)}
                  color="secondary"
                >
                  Buy for {book.price} cUSD
                </Button>
              )}
            </Box>
          </Box>
        )
      })}
    </Box>
  )
}
