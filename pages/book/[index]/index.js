import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

import BigNumber from "bignumber.js";

// https://github.com/gerhardsletten/react-reader
import { ReactReader } from "react-reader";

import { useContractState } from '../../../components/ContractProvider';

export default function Book() {
  const router = useRouter();
  const routerQuery = router.query;

  const bookIndex = parseInt(routerQuery.index);

  const contractState = useContractState();

  const [epubUrl, setEpubUrl] = useState();
  const [pageTitle, setPageTitle] = useState('Celo eBook Store');

  useEffect(() => {
    if (contractState.contract) {
      contractState.contract.methods.getBookEpub(bookIndex).call({ from: contractState.userAddress })
        .then(epub => {
          setEpubUrl(epub);

          contractState.contract.methods.getBookPublicDetails(bookIndex).call()
            .then(book => {
              const title = `Celo eBook Store : ${book[3]} - ${book[2]}`
              setPageTitle(title);
            })
        })
        .catch(err => {
          console.log(err);
        })
    } else {
      router.push('/');
    }

  }, [bookIndex, contractState.userAddress, contractState.contract, router]);

  // And your own state logic to persist state
  const [location, setLocation] = useState(null)
  const locationChanged = (epubcifi) => {
    // epubcifi is a internal string used by epubjs to point to a location in an epub. It looks like this: epubcfi(/6/6[titlepage]!/4/2/12[pgepubid00003]/3:0)
    setLocation(epubcifi)
  }

  return (
    <>
      <Head>
        <title>{ pageTitle }</title>
      </Head>
      <div style={{ height: "100vh" }}>
        {epubUrl ? (
          <ReactReader
            location={location}
            locationChanged={locationChanged}
            url={epubUrl}
          />
        ) : (
          <></>
        )}
      </div>
    </>
  )
}