import React from 'react'
import { useFormik } from 'formik';
import * as yup from 'yup';
import Book from 'epubjs/lib/book';
import BigNumber from "bignumber.js"

import { useContractState, ERC20_DECIMALS } from './ContractProvider';
import { useNotificationDispatch } from './Notification'

import {
  Box,
  Typography,
  Button,
  TextField,
} from '@mui/material';

global.XMLHttpRequest = require('xhr2');

export default function AddBook() {
  const CheckEpubButton = () => {
    return (
      <Button
        variant="contained"
        size="small"
        onClick={checkEpubUrl}
      >
        check
      </Button>
    )
  }

  const book = new Book();

  const contractState = useContractState();
  const notificationDispatch = useNotificationDispatch();

  const checkEpubUrl = () => {
    book.open(formik.values.epubUrl, 'epub')
      .then(() => {
        const { metadata } = book.packaging;
        const { title, creator } = metadata;

        const coverUrl = formik.values.epubUrl.replace('.epub', '.jpg')

        setFieldValue('coverUrl', coverUrl);
        setFieldValue('title', title);
        setFieldValue('author', creator);
      })
      .catch(err => {
        notificationDispatch({
          type: 'SET_NOTIFICATION',
          payload: 'ePub not valid'
        });

        setFieldValue('coverUrl', '');
        setFieldValue('title', '');
        setFieldValue('author', '');
      })
  }

  let validationSchema = yup.object().shape({
    epubUrl: yup
      .string()
      .required('ePub URL is required'),
    coverUrl: yup
      .string()
      .required('Cover URL is required'),
    title: yup
      .string()
      .required('Title is required'),
    author: yup
      .string()
      .required('Author is required'),
    price: yup
      .number()
      .min(1, 'Price must be higher than 1')
      .required('Price is required'),
  });

  const formik = useFormik({
    initialValues: {
      epubUrl: '',
      coverUrl: '',
      title: '',
      author: '',
      price: 1,
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setValues, resetForm }) => {
      const params = [
        values.epubUrl,
        values.coverUrl,
        values.title,
        values.author,
        new BigNumber(values.price).shiftedBy(ERC20_DECIMALS).toString()
      ];

      contractState.contract.methods.addBook(...params).send({ from: contractState.account })
        .then(res => {
          // setValues({
          //   epubUrl: '',
          //   coverUrl: '',
          //   title: '',
          //   author: '',
          //   price: 1,
          // });
          resetForm();

          notificationDispatch({
            type: 'SET_NOTIFICATION',
            payload: 'Book added successfully'
          });          
        })
        .catch(err => {
          notificationDispatch({
            type: 'SET_NOTIFICATION',
            payload: 'Only the contract owner can add books'
          });
        })
    }
  });

  const { setFieldValue, resetForm } = formik;

  return (
    <>
      <Typography variant="h5" sx={{ marginBottom: 1 }}>Add book</Typography>
      <form noValidate onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          margin="dense"
          name="epubUrl"
          type="text"
          label="ePub URL"
          InputProps={{ endAdornment: <CheckEpubButton /> }}
          value={formik.values.epubUrl}
          onChange={formik.handleChange}
          error={formik.touched.epubUrl && Boolean(formik.errors.epubUrl)}
          helperText={formik.touched.epubUrl && formik.errors.epubUrl}
        />
        <TextField
          fullWidth
          margin="dense"
          name="coverUrl"
          type="text"
          label="Cover URL"
          value={formik.values.coverUrl}
          onChange={formik.handleChange}
          error={formik.touched.coverUrl && Boolean(formik.errors.coverUrl)}
          helperText={formik.touched.coverUrl && formik.errors.coverUrl}
        />
        <TextField
          fullWidth
          margin="dense"
          name="title"
          type="text"
          label="Title"
          value={formik.values.title}
          onChange={formik.handleChange}
          error={formik.touched.title && Boolean(formik.errors.title)}
          helperText={formik.touched.title && formik.errors.title}
        />
        <TextField
          fullWidth
          margin="dense"
          name="author"
          type="text"
          label="Author"
          value={formik.values.author}
          onChange={formik.handleChange}
          error={formik.touched.author && Boolean(formik.errors.author)}
          helperText={formik.touched.author && formik.errors.author}
        />
        <TextField
          fullWidth
          margin="dense"
          name="price"
          type="text"
          label="Price (cUSD)"
          value={formik.values.price}
          onChange={formik.handleChange}
          error={formik.touched.price && Boolean(formik.errors.price)}
          helperText={formik.touched.price && formik.errors.price}
        />
        <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 3 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
          >
            Submit
          </Button>
        </Box>
      </form>
    </>
  )
}
