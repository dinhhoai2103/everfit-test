import { InputProps } from './declare'
import './styles.scss'

const Input = ({ label, error, className, ...props }: InputProps) => {
  return (
    <div className={`input ${className || ''}`}>
      {label && <label className='input__label'>{label}</label>}
      <input className={`input__field ${error ? 'input__field--error' : ''}`} {...props} />
      {error && <p className='input__error'>{error}</p>}
    </div>
  )
}

export default Input
