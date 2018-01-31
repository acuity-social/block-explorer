import * as t from '@/actions/types';
import { fromWei } from '@/adapters/web3';

import * as routes from '@/router';

const initialState = {};

export default (state = initialState, { type, payload }) => {
  if (type === t.FETCH_TRANSACTIONS_SUCCESS) {

    return {
      ...state,
      ...payload,
    };
  }
  return state;
}

export function getSingleTransaction(state, hash) {
  return state.transactions[hash] || {};
}

export function getCurrentTransactionForDisplay(state, methods = { getSingleTransaction, fromWei }) {
  // redux-first-router has issues with '0x' strings
  const locationHash = state.location.payload.hash || '';
  const hash = locationHash.replace('_', '');
  const transactionData = methods.getSingleTransaction(state, hash);
  let valueInWei = '';
  let valueInEther = '';
  let gasPriceInWei = 0;
  if (transactionData.value) {
    valueInWei = transactionData.value.toString(10);
    valueInEther = methods.fromWei(transactionData.value, 'ether');
  }

  if (transactionData.gasPrice) {
    gasPriceInWei = transactionData.gasPrice.toNumber();
  }

  return { ...transactionData, valueInWei, valueInEther, gasPriceInWei };
}

export function getTransactionInState(state, hash, methods = { getSingleTransaction }) {
  return Object.keys(methods.getSingleTransaction(state, hash)).length > 0;
}

export function getTransactionsForDisplay(state, hashes, methods = { getSingleTransaction, fromWei }) {
  const transactionsForDisplay = [];

  hashes.forEach(hash => {
    const transaction = methods.getSingleTransaction(state, hash);
    if (Object.keys(transaction).length > 0) {
      const displayTransaction = {
        key: {
          value: hash,
        },
        hash: {
          value: hash,
          linkType: routes.TRANSACTION_DETAIL,
          linkPayload: { hash },
        },
        amount: {
          value: `${methods.fromWei(transaction.value, 'ether')} Ether`,
        },
      };
      transactionsForDisplay.push(displayTransaction);
    }
  });

  return transactionsForDisplay;
}
