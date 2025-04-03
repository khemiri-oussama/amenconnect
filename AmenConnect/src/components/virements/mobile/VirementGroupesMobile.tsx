"use client"
import { useState, useEffect, useRef } from "react"
import type React from "react"
import { IonIcon, IonInput, IonSelect, IonSelectOption, IonButton } from "@ionic/react"
import { motion } from "framer-motion"
import {
  addOutline,
  trashOutline,
  checkmarkCircleOutline,
  alertCircleOutline,
  cloudUploadOutline,
} from "ionicons/icons"
import { useAuth } from "../../../AuthContext"
import useVirementGroupe from "../../../hooks/useVirementGroupe"
import { useBeneficiaries } from "../../../hooks/useBeneficiaries"

interface VirementGroupe {
  beneficiaireId: string
  montant: string
  motif: string
}

interface VirementGroupesMobileProps {
  onSuccess?: () => void
}

const VirementGroupesMobile: React.FC<VirementGroupesMobileProps> = ({ onSuccess }) => {
  const { profile } = useAuth()
  const { beneficiaires } = useBeneficiaries()
  const { loading, error, response, makeVirementGroupe } = useVirementGroupe()

  const [compteSource, setCompteSource] = useState("")
  const [mode, setMode] = useState<"csv" | "manuel">("manuel")
  const [virements, setVirements] = useState<VirementGroupe[]>([{ beneficiaireId: "", montant: "", motif: "" }])
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [csvPreview, setCsvPreview] = useState<any[]>([])
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (profile && profile.comptes && profile.comptes.length > 0) {
      setCompteSource(profile.comptes[0]._id)
    }
  }, [profile])

  useEffect(() => {
    if (beneficiaires.length > 0 && virements[0].beneficiaireId === "") {
      setVirements([{ beneficiaireId: beneficiaires[0]._id, montant: "", motif: "" }])
    }
  }, [beneficiaires])

  useEffect(() => {
    if (response?.success) {
      setSuccess(true)

      // Reset after success
      setTimeout(() => {
        if (onSuccess) onSuccess()
      }, 3000)
    }
  }, [response, onSuccess])

  const handleAddVirement = () => {
    setVirements([...virements, { beneficiaireId: beneficiaires[0]?._id || "", montant: "", motif: "" }])
  }

  const handleRemoveVirement = (index: number) => {
    if (virements.length === 1) return
    const newVirements = [...virements]
    newVirements.splice(index, 1)
    setVirements(newVirements)
  }

  const handleVirementChange = (index: number, field: keyof VirementGroupe, value: string) => {
    const newVirements = [...virements]
    newVirements[index][field] = value
    setVirements(newVirements)
  }

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setCsvFile(file)

    // Parse CSV file
    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      const rows = text.split("\n")
      const headers = rows[0].split(",")

      const parsedData = rows
        .slice(1)
        .filter((row) => row.trim())
        .map((row) => {
          const values = row.split(",")
          const rowData: any = {}
          headers.forEach((header, index) => {
            rowData[header.trim()] = values[index]?.trim() || ""
          })
          return rowData
        })

      setCsvPreview(parsedData)
    }

    reader.readAsText(file)
  }

  const handleSubmit = async () => {
    setErrorMsg("")

    // Basic validations
    if (!compteSource) {
      setErrorMsg("Veuillez sélectionner un compte source")
      return
    }

    if (mode === "manuel") {
      // Validate manual entries
      const invalidEntries = virements.some((v) => !v.beneficiaireId || !v.montant || Number.parseFloat(v.montant) <= 0)
      if (invalidEntries) {
        setErrorMsg("Veuillez remplir correctement tous les champs pour chaque virement")
        return
      }

      // Construct the payload for the API
      const data = {
        fromAccount: compteSource,
        virements: virements.map((v) => ({
          beneficiary: v.beneficiaireId,
          amount: Number.parseFloat(v.montant),
          motif: v.motif,
        })),
      }

      await makeVirementGroupe(data)
    } else {
      // Validate CSV
      if (!csvFile || csvPreview.length === 0) {
        setErrorMsg("Veuillez importer un fichier CSV valide")
        return
      }

      const data = {
        fromAccount: compteSource,
        virements: csvPreview.map((row) => ({
          beneficiary: row.accountNumber,
          amount: Number.parseFloat(row.amount),
          motif: row.reason || "",
        })),
      }

      await makeVirementGroupe(data)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-TN", {
      style: "currency",
      currency: "TND",
    }).format(amount)
  }

  // Calculate total amount from either manual entries or CSV preview
  const totalAmount =
    mode === "manuel"
      ? virements.reduce((sum, v) => sum + (Number.parseFloat(v.montant) || 0), 0)
      : csvPreview.reduce((sum, row) => sum + (Number.parseFloat(row.amount) || 0), 0)

  if (success) {
    return (
      <motion.div
        className="success-container"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="success-icon">
          <IonIcon icon={checkmarkCircleOutline} />
        </div>
        <h3 className="success-title">Virements groupés effectués avec succès</h3>
        <p className="success-message">
          Vos virements ont été traités avec succès. Un email de confirmation vous a été envoyé.
        </p>
      </motion.div>
    )
  }

  return (
    <div className="virement-groupes-mobile">
      {(errorMsg || error) && (
        <div className="error-message">
          <IonIcon icon={alertCircleOutline} />
          <span>{errorMsg || error}</span>
        </div>
      )}

      <div className="form-group">
        <label className="form-label">Compte source</label>
        <IonSelect
          className="form-select"
          value={compteSource}
          placeholder="Sélectionner un compte"
          onIonChange={(e) => setCompteSource(e.detail.value)}
        >
          {profile?.comptes?.map((compte) => (
            <IonSelectOption key={compte._id} value={compte._id}>
              {compte.type} - {compte.numéroCompte} ({compte.solde} TND)
            </IonSelectOption>
          ))}
        </IonSelect>
      </div>

      <div className="mode-toggle">
        <button className={`toggle-button ${mode === "manuel" ? "active" : ""}`} onClick={() => setMode("manuel")}>
          Saisie manuelle
        </button>
        <button className={`toggle-button ${mode === "csv" ? "active" : ""}`} onClick={() => setMode("csv")}>
          Import CSV
        </button>
      </div>

      {mode === "manuel" ? (
        <div className="manual-entries">
          {virements.map((virement, index) => (
            <div key={index} className="virement-entry">
              <div className="form-group">
                <label className="form-label">Bénéficiaire</label>
                <IonSelect
                  className="form-select"
                  value={virement.beneficiaireId}
                  onIonChange={(e) => handleVirementChange(index, "beneficiaireId", e.detail.value)}
                >
                  {beneficiaires.map((ben) => (
                    <IonSelectOption key={ben._id} value={ben._id}>
                      {ben.prenom} {ben.nom}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Montant</label>
                  <IonInput
                    type="number"
                    className="form-input"
                    value={virement.montant}
                    placeholder="0.00"
                    onIonChange={(e) => handleVirementChange(index, "montant", e.detail.value || "")}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Motif</label>
                  <IonInput
                    className="form-input"
                    value={virement.motif}
                    placeholder="Motif"
                    onIonChange={(e) => handleVirementChange(index, "motif", e.detail.value || "")}
                  />
                </div>
              </div>

              <button
                className="remove-button"
                onClick={() => handleRemoveVirement(index)}
                disabled={virements.length === 1}
              >
                <IonIcon icon={trashOutline} />
              </button>
            </div>
          ))}

          <button className="add-button" onClick={handleAddVirement}>
            <IonIcon icon={addOutline} />
            Ajouter un bénéficiaire
          </button>
        </div>
      ) : (
        <div className="csv-upload">
          <div className="file-upload-container">
            <input type="file" accept=".csv" onChange={handleCsvUpload} ref={fileInputRef} className="file-input" />
            <div className="file-upload-button">
              <IonIcon icon={cloudUploadOutline} />
              <span>{csvFile ? csvFile.name : "Choisir un fichier CSV"}</span>
            </div>
          </div>
          <div className="file-format-info">Format: name,accountNumber,amount,reason</div>

          {csvPreview.length > 0 && (
            <div className="csv-preview">
              <h4>Aperçu ({csvPreview.length} virements)</h4>
              <div className="preview-list">
                {csvPreview.slice(0, 3).map((row, index) => (
                  <div key={index} className="preview-item">
                    <div className="preview-name">{row.name}</div>
                    <div className="preview-amount">{formatCurrency(Number.parseFloat(row.amount) || 0)}</div>
                  </div>
                ))}
                {csvPreview.length > 3 && <div className="preview-more">+{csvPreview.length - 3} autres virements</div>}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="transfer-summary">
        <div className="summary-item">
          <span className="summary-label">Nombre de virements:</span>
          <span className="summary-value">{mode === "manuel" ? virements.length : csvPreview.length}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Montant total:</span>
          <span className="summary-value">{formatCurrency(totalAmount)}</span>
        </div>
      </div>

      <IonButton
        expand="block"
        className="submit-button"
        onClick={handleSubmit}
        disabled={loading || (mode === "manuel" ? virements.length === 0 : csvPreview.length === 0)}
      >
        {loading ? "Traitement en cours..." : "Effectuer les virements"}
      </IonButton>
    </div>
  )
}

export default VirementGroupesMobile

