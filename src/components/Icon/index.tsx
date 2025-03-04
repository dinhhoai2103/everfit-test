import { IconProps } from './declare'
import './styles.scss'

export default function Icon({ className, icon, size, onClick }: IconProps) {
  return (
    <div className={`icon-wrap ${className || ''}`} style={{ fontSize: size }} onClick={onClick}>
      {icon}
    </div>
  )
}
