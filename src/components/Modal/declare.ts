import { ReactNode } from 'react'
import { ButtonProps } from '../Button/declare'

export interface ModalContextValue {
  isOpen: boolean
  closable?: boolean
  open: () => void
  close: () => void
}

export interface ModalProps {
  isOpen?: boolean
  closable?: boolean
  onOpen?: () => void
  onClose?: () => void
  children?: ReactNode
}

export interface ModalBodyProps {
  children?: ReactNode
}

export interface ModalContentProps {
  children?: ReactNode
}

export interface ModalCancelButtonProps extends ButtonProps {
  text?: string
}

export interface ModalOkButtonProps extends ButtonProps {
  text?: string
  loading?: boolean
  closable?: boolean
}

export interface ModalFooterProps {
  isCancel?: boolean
  isOk?: boolean
  onClickOk?: () => void
}

export interface ModalHeaderProps {
  hasIcon?: boolean
  onClose?: () => void
  title: string
}
