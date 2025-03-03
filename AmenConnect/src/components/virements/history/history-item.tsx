import type React from "react"
import type { Transfer } from "../types/transfer"

interface HistoryItemProps {
  transfer: Transfer
}

const HistoryItem: React.FC<HistoryItemProps> = ({ transfer }) => {
  const date = new Date(transfer.date)

  return (
    <div className="history-item">
      <div className="history-date">
        <div className="day">{date.getDate()}</div>
        <div className="month">{date.toLocaleDateString("fr", { month: "short" })}</div>
      </div>

      <div className="history-details">
        <div className="history-top">
          <h4>{transfer.beneficiaryName}</h4>
          <div className={`history-amount outgoing`}>-{transfer.amount.toFixed(2)} DT</div>
        </div>
        <div className="history-bottom">
          <div className="history-info">
            <span>De: {transfer.accountFrom}</span>
            <span className="separator">•</span>
            <span>Motif: {transfer.reason}</span>
          </div>
          <div className={`history-status status-${transfer.status}`}>
            {transfer.status === "completed" && "Complété"}
            {transfer.status === "pending" && "En attente"}
            {transfer.status === "failed" && "Échoué"}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HistoryItem

