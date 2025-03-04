import { createContext, useContext, useEffect, useId, useMemo } from 'react'
import {
  ModalBodyProps,
  ModalCancelButtonProps,
  ModalContentProps,
  ModalContextValue,
  ModalFooterProps,
  ModalHeaderProps,
  ModalOkButtonProps,
  ModalProps
} from './declare'
import Button from '../Button'
import './styles.scss'
import Icon from '../Icon'
import { CloseIcon } from '../../assets/icons/CloseIcon'
import { useModalStatus } from '@/hooks/useModalStatus'

const ModalContext = createContext<ModalContextValue>({
  isOpen: false,
  closable: true,
  open: () => {},
  close: () => {}
})

const ModalContent = ({ children }: ModalContentProps) => {
  const id = useId()
  const { isOpen } = useContext(ModalContext)

  return (
    <div id={id} className={`modal-content modal-overlay${isOpen ? ' active' : ''}`}>
      {children}
    </div>
  )
}

const ModalContainer = (props: ModalBodyProps) => {
  const { children } = props

  return <div className='modal-container'>{children}</div>
}

const ModalBody = (props: ModalBodyProps) => {
  const { children } = props

  return <div className='modal-body'>{children}</div>
}

const ModalHeader = ({ onClose, hasIcon, title }: ModalHeaderProps) => {
  return (
    <div className='modal-header'>
      {hasIcon && (
        <div className='modal-header-icon'>
          <Icon icon={<CloseIcon />} onClick={onClose} />
        </div>
      )}
      <h3 className='modal-header-title'>{title}</h3>
    </div>
  )
}

const ModalFooter = ({ isCancel = true, isOk = true, onClickOk }: ModalFooterProps) => {
  return (
    <div className='modal-footer'>
      {isOk && <ModalOkButton onClick={onClickOk} />}
      {isCancel && <ModalCancelButton className='secondary' />}
    </div>
  )
}

const ModalCancelButton = (props: ModalCancelButtonProps) => {
  const { text = 'Cancel', onClick, ...rest } = props
  const { close, closable } = useContext(ModalContext)

  return (
    <Button
      onClick={(e) => {
        if (!closable) return

        close()
        onClick?.(e)
      }}
      {...rest}
    >
      {text}
    </Button>
  )
}

const ModalOkButton = (props: ModalOkButtonProps) => {
  const { text = 'OK', loading, closable, onClick, ...rest } = props
  const { close } = useContext(ModalContext)

  return (
    <Button
      loading={loading}
      type='submit'
      onClick={(e) => {
        if (onClick) {
          onClick(e)
        }
        if (closable) {
          close()
        }
      }}
      {...rest}
    >
      {text}
    </Button>
  )
}

const Modal = (props: ModalProps) => {
  const { children, closable = true, onOpen, onClose } = props
  const { isOpen, open, close } = useModalStatus()

  const contextValue = useMemo(
    () => ({
      isOpen,
      closable,
      open: () => {
        open()
        if (onOpen) {
          onOpen()
        }
      },
      close: () => {
        close()
        if (onClose) {
          onClose()
        }
      }
    }),
    [isOpen, closable, open, close, onClose, onOpen]
  )

  useEffect(() => {
    if (props.isOpen) {
      open()
    } else {
      close()
    }
  }, [props.isOpen, open, close])

  return isOpen && <ModalContext.Provider value={contextValue}>{children}</ModalContext.Provider>
}

export { Modal, ModalBody, ModalCancelButton, ModalOkButton, ModalFooter, ModalContent, ModalHeader, ModalContainer }
