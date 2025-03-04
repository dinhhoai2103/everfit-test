import { ButtonProps } from './declare'
import './style.scss'

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  className,
  children,
  loading,
  ...props
}) => {
  return (
    <button disabled={loading} className={`button ${variant} ${size} ${className || ''}`} {...props}>
      {children}
    </button>
  )
}

export default Button
