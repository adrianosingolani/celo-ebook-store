import React, { useEffect, useCallback } from 'react';
import Web3 from "web3";
import { newKitFromWeb3 } from "@celo/contractkit";

import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  Tooltip,
  Modal
} from '@mui/material';

import {
  AccountBalanceWallet as WalletIcon,
  // Menu as MenuIcon
} from '@mui/icons-material';

import { useContractState, useContractDispatch, ERC20_DECIMALS } from './ContractProvider';
import { useNotificationDispatch } from './Notification'
import AddBook from './AddBook';
import Link from './Link';

export default function TopBar() {
  const contractDispatch = useContractDispatch();
  const contractState = useContractState();
  const notificationDispatch = useNotificationDispatch();

  const connectCeloExtensionWallet = useCallback(() => {
    if (window.celo) {
      window.celo.enable()
        .then(async () => {
          const web3 = new Web3(window.celo)
          const kit = newKitFromWeb3(web3)

          const accounts = await kit.web3.eth.getAccounts()
          const defaultAccount = accounts[0]

          const bigBalance = await kit.getTotalBalance(defaultAccount);
          const balance = bigBalance.cUSD.shiftedBy(-ERC20_DECIMALS).toFixed(2);

          contractDispatch({
            type: 'CONNECT_WALLET',
            payload: {
              userAddress: defaultAccount,
              balance: balance,
              kit: kit
            }
          })
        })
        .catch((error) => {
          notificationDispatch({
            type: 'SET_NOTIFICATION',
            payload: error.message
          });
        })
    }
  }, [contractDispatch, notificationDispatch])

  useEffect(() => {
    if (window.celo) {
      if (window.celo.selectedAddress) {
        connectCeloExtensionWallet()
      } else {
        notificationDispatch({
          type: 'SET_NOTIFICATION',
          payload: 'Connect your CeloExtensionWallet to use this DApp'
        });
      }

      window.celo.on('accountsChanged', async function (accounts) {
        if (window.celo.selectedAddress) {
          connectCeloExtensionWallet();
        } else {
          contractDispatch({
            type: 'RESET_STATE',
          });

          notificationDispatch({
            type: 'SET_NOTIFICATION',
            payload: 'Connect your CeloExtensionWallet to use this DApp'
          });
        }
      })
    } else {
      notificationDispatch({
        type: 'SET_NOTIFICATION',
        payload: 'Please install the CeloExtensionWallet'
      });
    }
  }, [connectCeloExtensionWallet, contractDispatch, notificationDispatch]);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    maxWidth: '800px',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ mb: 2 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>Celo eBook Store</Typography>
          <Box component="nav">
            <Button component={Link} color="inherit" href="/">Store</Button>
            <Button component={Link} color="inherit" href="/library">Library</Button>
            <Button variant="text" color="inherit" onClick={handleOpen}>Add book</Button>
          </Box>
          <Tooltip
            title={contractState.userAddress ? contractState.userAddress : ''}
            placement="bottom-end"
            arrow
            disableFocusListener
            disableTouchListener
            disableHoverListener={contractState.userAddress ? false : true}
          >
            <Button
              size="small" variant="outlined" sx={{ ml: 1, textTransform: 'none' }}
              onClick={connectCeloExtensionWallet}
              endIcon={<WalletIcon />}
            >
              {contractState.balance ? `cUSD ${contractState.balance}` : 'Not connected'}
            </Button>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* add book modal */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <AddBook />
        </Box>
      </Modal>
    </Box>
  );
}