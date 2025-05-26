import React, { forwardRef, useImperativeHandle, useState } from 'react'
import './style.scss'

const Modal = forwardRef((props, ref) => {
  const [isOpen, setIsOpen] = useState(false)
  const [config, setConfig] = useState({})

  useImperativeHandle(ref, () => ({
    // This exposes custom functions (open, close) on the ref
    open: (modalConfig) => {
      setConfig(modalConfig)
      setIsOpen(true)
    },
    close: () => setIsOpen(false),
  }))

  if (!isOpen) return null

  const {
    header,
    subtitle,
    body,
    primaryButton,
  } = config

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal__header">
          <h2>{header}</h2>
          {subtitle && <p className="modal__subtitle">{subtitle}</p>}
        </div>

        <div className="modal__body">{body}</div>

        <div className="modal__footer">
          {primaryButton?.enabled && (
            <button
              onClick={primaryButton.onClick}
              className="modal__primary"
            >
              {primaryButton.text || 'OK'}
            </button>
          )}
          <button
            onClick={() => setIsOpen(false)}
            className="modal__secondary"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
})

export default Modal
