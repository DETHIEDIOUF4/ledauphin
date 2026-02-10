import { formatFCFA } from '../utils/currency'
import './ReceiptPrint.css'

const RESTAURANT_NAME = 'Le Restaurant Dauphin'

export default function ReceiptPrint({ order }) {
  if (!order) return null
  const date = new Date(order.createdAt)
  const serveuse = order.serveuse || ''
  const table = order.tableNumber ? `Table ${order.tableNumber}` : ''
  const prisPar = order.createdBy?.name ? `Pris par: ${order.createdBy.name}` : ''

  return (
    <div className="receipt-80mm-inner" id="receipt-print-area">
      <div className="receipt-inner">
        <h1 className="receipt-title">{RESTAURANT_NAME}</h1>
        <p className="receipt-date">{date.toLocaleString('fr-FR')}</p>
        {serveuse && <p className="receipt-serveuse">Serveuse: {serveuse}</p>}
        {table && <p className="receipt-table">{table}</p>}
        {prisPar && <p className="receipt-pris-par">{prisPar}</p>}
        <hr className="receipt-hr" />
        <ul className="receipt-lines">
          {order.items?.map((item, i) => (
            <li key={i} className="receipt-line">
              <span className="receipt-line-name">{item.name} x{item.quantity}</span>
              <span className="receipt-line-subtotal">{formatFCFA(item.subtotal)}</span>
            </li>
          ))}
        </ul>
        <hr className="receipt-hr" />
        <p className="receipt-total">
          <span>Total</span>
          <strong>{formatFCFA(order.total)}</strong>
        </p>
        <p className="receipt-footer">Merci pour votre visite</p>
      </div>
    </div>
  )
}
