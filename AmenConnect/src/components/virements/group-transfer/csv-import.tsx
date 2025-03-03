import type React from "react"
import { useRef } from "react"
import { IonButton, IonIcon } from "@ionic/react"
import { cloudUploadOutline, checkmarkCircleOutline } from "ionicons/icons"

interface CsvImportProps {
  csvFile: File | null
  csvData: any[]
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: () => void
}

const CsvImport: React.FC<CsvImportProps> = ({ csvFile, csvData, onFileUpload, onSubmit }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="csv-upload-container">
      <div className="csv-upload-box">
        <input
          type="file"
          accept=".csv"
          onChange={onFileUpload}
          className="file-input"
          ref={fileInputRef}
          id="csv-upload"
        />
        <label htmlFor="csv-upload" className="file-label">
          <IonIcon icon={cloudUploadOutline} className="upload-icon" />
          <span>Cliquez pour sélectionner un fichier CSV</span>
          {csvFile && <span className="file-name">{csvFile.name}</span>}
        </label>
      </div>

      {csvData.length > 0 && (
        <div className="csv-preview">
          <h4>Aperçu des données ({csvData.length} bénéficiaires)</h4>
          <div className="csv-table-container">
            <table className="csv-table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Numéro de compte</th>
                  <th>Montant</th>
                  <th>Motif</th>
                </tr>
              </thead>
              <tbody>
                {csvData.slice(0, 5).map((row, index) => (
                  <tr key={index}>
                    <td>{row.name}</td>
                    <td>{row.accountNumber}</td>
                    <td>{row.amount} DT</td>
                    <td>{row.reason || "-"}</td>
                  </tr>
                ))}
                {csvData.length > 5 && (
                  <tr>
                    <td colSpan={4} className="more-rows">
                      ... et {csvData.length - 5} autres bénéficiaires
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="csv-actions">
            <IonButton expand="block" onClick={onSubmit}>
              Confirmer les virements
              <IonIcon slot="end" icon={checkmarkCircleOutline} />
            </IonButton>
          </div>
        </div>
      )}

      <div className="csv-instructions">
        <h4>Format du fichier CSV</h4>
        <p>Le fichier CSV doit contenir les colonnes suivantes :</p>
        <ul>
          <li>name - Nom du bénéficiaire</li>
          <li>accountNumber - Numéro de compte du bénéficiaire</li>
          <li>amount - Montant du virement (en DT)</li>
          <li>reason - Motif du virement (optionnel)</li>
        </ul>
        <p>Exemple : name,accountNumber,amount,reason</p>
        <p>Ahmed Ali,TN591000067891234567890,500,Loyer</p>
      </div>
    </div>
  )
}

export default CsvImport

