import { forwardRef, useImperativeHandle, useState } from 'react'
import './style.scss'

const Modal = forwardRef((props, ref) => {
  const [isOpen, setIsOpen] = useState(false)
  const [config, setConfig] = useState({
    header: '',
    subtitle: '',
    body: '',
    primaryButton: {},
    onClose: null
  })
  const [resultTextConfig, setResultTextConfig] = useState('')

  useImperativeHandle(ref, () => ({
    // This exposes custom functions (open, close) on the ref
    open: (modalConfig) => {
      setConfig(modalConfig)
      setIsOpen(true)
    },
    close: () => setIsOpen(false),
    setText: (config) => setResultTextConfig(config)
  }))

  if (!isOpen) return null

  const { header, subtitle, body, primaryButton, onClose } = config

  const handlePrimaryClick = () => {
    // primaryButton.enabled = false
    primaryButton.onClick()
  }

  const handleSecondaryClick = () => {
    console.log('closing')
    setIsOpen(false)
    setResultTextConfig('')
    onClose?.()
  }

  return (
    <div className='modal-overlay'>
      <div className='modal'>
        <div className='modal__header'>
          <h2>{header}</h2>
          {subtitle && <p className='modal__subtitle'>{subtitle}</p>}
        </div>

        <div className='modal__body'>{body}</div>

        <div className='modal__footer'>
          {primaryButton?.enabled && (
            <button onClick={handlePrimaryClick} className='modal__primary'>
              {primaryButton.text || 'OK'}
            </button>
          )}
          <button onClick={handleSecondaryClick} className='modal__secondary'>
            Close
          </button>
        </div>
        <div
          className={`modal__result-text${
            resultTextConfig.success ? '--success' : '--error'
          }`}
        >
          {resultTextConfig.text}
        </div>
      </div>
    </div>
  )
})

export default Modal
