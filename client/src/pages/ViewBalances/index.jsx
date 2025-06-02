import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { FaPen, FaTrash } from 'react-icons/fa'
import { fetchWithAuth } from '../../utils/apiUtils'
import { useAuth0 } from '@auth0/auth0-react'
import { formatUTCDateOnly } from '../../utils/dateUtils'
import { modalRef } from '../../services/modalService' // The modalref needed to open and close modal
import './style.scss'

export default function BalanceCards() {
  const [balances, setBalances] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ asOfDate: '', amount: '' })
  const { getAccessTokenSilently } = useAuth0()
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const getData = async () => {
    return await fetchWithAuth({
      path: `/api/balances?page=${page}&limit=10`,
      method: 'GET',
      getToken: getAccessTokenSilently
    })
  }

  useEffect(() => {
    async function fetchBalances() {
      const res = await getData()
      const { data, totalPages } = await res.json()
      setBalances(data)
      setHasMore(page < totalPages)
    }
    fetchBalances()
  }, [])

  const handleEditClick = (bal) => {
    setEditingId(bal._id)
    setForm({
      asOfDate: bal.asOfDate ? bal.asOfDate.slice(0, 10) : '',
      amount: bal.amount !== undefined ? bal.amount.toString() : ''
    })
  }

  const handleDelete = async (id) => {
    modalRef.current.open({
      header: 'Are you sure you want to delete this item?',
      subtitle: 'This action cannot be undone',
      primaryButton: {
        enabled: true,
        text: 'OK',
        onClick: async () => {
          try {
            await fetchWithAuth({
              path: `/api/balances/${id}`,
              method: 'DELETE',
              getToken: getAccessTokenSilently
            })
            setBalances((prev) => prev.filter((bal) => bal._id !== id))
            modalRef.current.close()
          } catch (err) {
            console.error(err)
            modalRef.current.setText({
              error: true,
              text: 'An error occurred while deleting.'
            })
          }
        }
      }
    })
  }

  const handleSave = async () => {
    try {
      if (!editingId) return

      const res = await fetchWithAuth({
        path: `/api/balances/${editingId}`,
        method: 'PUT',
        getToken: getAccessTokenSilently,
        body: {
          asOfDate: form.asOfDate,
          amount: parseFloat(form.amount)
        }
      })

      if (!res.ok) {
        console.error('Failed to update balance')
        return
      }

      const updatedBal = await res.json()

      setBalances((prev) =>
        prev.map((bal) => (bal._id === editingId ? updatedBal : bal))
      )

      setEditingId(null)
    } catch (error) {
      console.error(error)
    }
  }

  const handleClose = () => {
    setEditingId(null)
  }

  return (
    <>
      <h3 className='balance-cards__header'>Balances</h3>
      <div className='balance-cards'>
        {balances.map((bal) => {
          const isEditing = bal._id === editingId
          return (
            <div key={bal._id} className='balance-cards__card'>
              <div className='balance-cards__details'>
                <div className='balance-cards__field'>
                  {isEditing ? (
                    <>
                      <div className='balance-cards__label'>As Of Date:</div>
                      <input
                        className='balance-cards__form-input'
                        type='date'
                        value={form.asOfDate}
                        onChange={(e) =>
                          setForm({ ...form, asOfDate: e.target.value })
                        }
                      />
                    </>
                  ) : (
                    <div className='balance-cards__value'>
                      {bal.asOfDate
                        ? format(
                            formatUTCDateOnly(bal.asOfDate),
                            'MMM dd, yyyy'
                          )
                        : 'No Date'}
                    </div>
                  )}
                </div>

                <div className='balance-cards__field'>
                  {isEditing ? (
                    <>
                      <div className='balance-cards__label'>Amount:</div>
                      <input
                        className='balance-cards__form-input'
                        type='number'
                        step='0.01'
                        value={form.amount}
                        onChange={(e) =>
                          setForm({ ...form, amount: e.target.value })
                        }
                      />
                    </>
                  ) : (
                    <div className='balance-cards__value'>
                      ${Number(bal.amount).toLocaleString()}
                    </div>
                  )}
                </div>
              </div>

              <div className='balance-cards__actions'>
                {!isEditing && (
                  <>
                    <FaPen
                      className='balance-cards__icon balance-cards__icon--edit'
                      onClick={() => handleEditClick(bal)}
                    />
                    <FaTrash
                      className='balance-cards__icon balance-cards__icon--delete'
                      onClick={() => handleDelete(bal._id)}
                    />
                  </>
                )}
                {isEditing && (
                  <>
                    <button
                      onClick={handleSave}
                      className='balance-cards__edit-button'
                    >
                      Save
                    </button>
                    <button
                      onClick={handleClose}
                      className='balance-cards__edit-button'
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          )
        })}
        <div className='balance-pagination'>
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
