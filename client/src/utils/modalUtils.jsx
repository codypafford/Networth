import { modalRef } from '../services/modalService'
import AddTransaction from '../components/Modal/Modals/AddTransaction'
import AddBalance from '../components/Modal/Modals/AddBalance'
import { fetchWithAuth } from '../utils/apiUtils'

export const addTransactionModal = (getAccessTokenSilently) => {
  modalRef.current.open({
    header: 'Add Transaction',
    subtitle: 'What did you buy?',
    body: (
      <AddTransaction
        onSubmit={async (data) =>
          await fetchWithAuth({
            path: '/api/transactions',
            method: 'POST',
            body: data,
            getToken: getAccessTokenSilently
          })
        }
      />
    ),
    primaryButton: {
      enabled: false
    }
  })
}

export const addBalanceModal = (getAccessTokenSilently) => {
  modalRef.current.open({
    header: 'Add Balance',
    subtitle: 'How much money do you currently have saved up?',
    body: (
      <AddBalance
        onSubmit={async (data) =>
          await fetchWithAuth({
            path: '/api/balances',
            method: 'POST',
            body: data,
            getToken: getAccessTokenSilently
          })
        }
      />
    ),
    primaryButton: {
      enabled: false
    }
  })
}
