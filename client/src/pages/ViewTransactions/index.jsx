import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { FaPen, FaTrash } from 'react-icons/fa'
import { fetchWithAuth } from '../../utils/apiUtils'
import { useAuth0 } from '@auth0/auth0-react'
import { TrackingTypes } from '../../constants'
import './style.scss'

export default function TransactionCards() {
  const [transactions, setTransactions] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ name: '', amount: '', date: '' })
  const { getAccessTokenSilently } = useAuth0()
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const getData = async () => {
    return await fetchWithAuth({
      path: `/api/transactions?page=${page}&limit=10`,
      method: 'GET',
      getToken: getAccessTokenSilently
    })
  }

  useEffect(() => {
    async function fetchTransactions() {
      const res = await getData()
      const { data, totalPages } = await res.json()
      console.log('the data', data)
      setTransactions(data)
      setHasMore(page < totalPages)
    }
    fetchTransactions()
  }, [page])

  const handleEditClick = (tx) => {
    setEditingId(tx._id)
    setForm({
      name: tx.name || '',
      amount: tx.amount || '',
      date: tx.date ? tx.date.slice(0, 10) : '' // YYYY-MM-DD for date input
    })
  }

  const handleDelete = async (id) => {
    await fetchWithAuth({
      path: `/api/transactions/${id}`,
      method: 'DELETE',
      getToken: getAccessTokenSilently
    })
    setTransactions((prev) => prev.filter((tx) => tx._id !== id))
  }

  const handleSave = async () => {
    await fetchWithAuth({
      path: `/api/transactions/${editingId}`,
      method: 'PUT',
      getToken: getAccessTokenSilently,
      body: {
        name: form.name,
        amount: form.amount,
        date: form.date
      }
    })
    setEditingId(null)
    const res = await getData()
    const { data, totalPages } = await res.json()
    setTransactions(data)
  }

  const handleClose = () => {
    setEditingId(null)
  }

  return (
    <>
      <h3 className='transaction-header'>Transactions</h3>
      <div className='transaction-cards'>
        {transactions.map((tx) => {
          const isEditing = tx._id === editingId
          return (
            <div key={tx._id} className='transaction-cards__card'>
              <div className='transaction-cards__details'>
                <div className='transaction-cards__field'>
                  {isEditing ? (
                    <>
                      {' '}
                      <div className='transaction-cards__label'>Name:</div>
                      <input
                        className='transaction-cards__form-input'
                        type='text'
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                      />
                    </>
                  ) : (
                    <div className='transaction-cards__value'>
                      {tx.name || 'No Name'}
                    </div>
                  )}
                </div>

                <div className='transaction-cards__field'>
                  {isEditing ? (
                    <>
                      <div className='transaction-cards__label'>Amount:</div>

                      <input
                        className='transaction-cards__form-input'
                        type='number'
                        value={form.amount}
                        onChange={(e) =>
                          setForm({ ...form, amount: e.target.value })
                        }
                      />
                    </>
                  ) : (
                    <div className='transaction-cards__value'>
                      ${Number(tx.amount).toLocaleString()}
                    </div>
                  )}
                </div>

                <div className='transaction-cards__field'>
                  {isEditing ? (
                    <>
                      <div className='transaction-cards__label'>Date:</div>

                      <input
                        className='transaction-cards__form-input'
                        type='date'
                        value={form.date}
                        onChange={(e) =>
                          setForm({ ...form, date: e.target.value })
                        }
                      />
                    </>
                  ) : (
                    <div className='transaction-cards__value'>
                      {tx.date
                        ? format(new Date(tx.date), 'MMM d, yyyy')
                        : 'No Date'}
                    </div>
                  )}
                </div>

                {/* Render other non-editable info if needed */}
                {/* Example: category */}
                {tx.category && (
                  <div className='transaction-cards__field'>
                    <div className='transaction-cards__value'>
                      {TrackingTypes[tx.category].friendlyText}
                    </div>
                  </div>
                )}
              </div>

              <div className='transaction-cards__actions'>
                {!isEditing && (
                  <>
                    <FaPen
                      className='transaction-cards__icon transaction-cards__icon--edit'
                      onClick={() => handleEditClick(tx)}
                    />
                    <FaTrash
                      className='transaction-cards__icon transaction-cards__icon--delete'
                      onClick={() => handleDelete(tx._id)}
                    />
                  </>
                )}
                {isEditing && (
                  <>
                    <button
                      onClick={handleSave}
                      className='transaction-cards__edit-button'
                    >
                      Save
                    </button>
                    <button
                      onClick={handleClose}
                      className='transaction-cards__edit-button'
                    >
                      Done
                    </button>
                  </>
                )}
              </div>
            </div>
          )
        })}
        <div className='transaction-pagination'>
          <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
            Previous
          </button>
          <span>Page {page}</span>
          <button disabled={!hasMore} onClick={() => setPage(page + 1)}>
            Next
          </button>
        </div>
      </div>
    </>
  )
}
