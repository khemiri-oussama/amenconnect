import type React from "react";
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonIcon,
  IonContent,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonInput,
  IonToggle,
} from "@ionic/react";
import { closeCircleOutline, checkmarkCircleOutline } from "ionicons/icons";
import type { Beneficiary } from "./../types/beneficiary";
import type { Account } from "./../types/accounts";

export interface TransferModalProps {
  isOpen: boolean;
  isRecurring: boolean;
  transfer: {
    beneficiaryId: string;
    accountFrom: string;
    amount: string;
    reason: string;
    date: string;
    frequency: string;
    endDate: string;
  };
  beneficiaries: Beneficiary[];
  accounts: Account[];
  onClose: () => void;
  onTransferChange: (field: string, value: string) => void;
  onToggleRecurring: (value: boolean) => void;
  onSubmit: () => void;
}

const TransferModal: React.FC<TransferModalProps> = ({
  isOpen,
  isRecurring,
  transfer,
  beneficiaries,
  accounts,
  onClose,
  onTransferChange,
  onToggleRecurring,
  onSubmit,
}) => {
  const selectedBeneficiary = beneficiaries.find(
    (b) => b.id === transfer.beneficiaryId
  );
  const selectedAccount = accounts.find((a) => a.value === transfer.accountFrom);

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            {isRecurring ? "Virement Récurrent" : "Confirmer le Virement"}
          </IonTitle>
          <IonButton slot="end" fill="clear" onClick={onClose}>
            <IonIcon icon={closeCircleOutline} />
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {isRecurring ? (
          <div className="recurring-form">
            <h3>Configurer la récurrence</h3>

            <IonItem>
              <IonLabel>Compte source</IonLabel>
              <IonSelect
                value={transfer.accountFrom}
                onIonChange={(e) =>
                  onTransferChange("accountFrom", e.detail.value ?? "")
                }
              >
                {accounts.map((account) => (
                  <IonSelectOption key={account.id} value={account.value}>
                    {account.label} ({account.balance.toLocaleString("fr-FR")} DT)
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>

            <IonItem>
              <IonLabel>Fréquence</IonLabel>
              <IonSelect
                value={transfer.frequency}
                onIonChange={(e) =>
                  onTransferChange("frequency", e.detail.value ?? "")
                }
              >
                <IonSelectOption value="once">Une seule fois</IonSelectOption>
                <IonSelectOption value="daily">Quotidien</IonSelectOption>
                <IonSelectOption value="weekly">Hebdomadaire</IonSelectOption>
                <IonSelectOption value="monthly">Mensuel</IonSelectOption>
                <IonSelectOption value="quarterly">Trimestriel</IonSelectOption>
                <IonSelectOption value="yearly">Annuel</IonSelectOption>
              </IonSelect>
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Date de début</IonLabel>
              <IonInput
                type="date"
                value={transfer.date.substring(0, 10)}
                onIonChange={(e) =>
                  onTransferChange("date", e.detail.value ?? "")
                }
                min={new Date().toISOString().substring(0, 10)}
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">
                Date de fin (optionnel)
              </IonLabel>
              <IonInput
                type="date"
                value={transfer.endDate}
                onIonChange={(e) =>
                  onTransferChange("endDate", e.detail.value ?? "")
                }
                min={transfer.date.substring(0, 10)}
              />
            </IonItem>

            <div className="modal-summary">
              <h4>Résumé du virement</h4>
              <div className="summary-item">
                <span>Bénéficiaire:</span>
                <span>{selectedBeneficiary?.name || "Non sélectionné"}</span>
              </div>
              <div className="summary-item">
                <span>Montant:</span>
                <span>{transfer.amount || "0"} DT</span>
              </div>
              <div className="summary-item">
                <span>Compte source:</span>
                <span>{selectedAccount?.label || "-"}</span>
              </div>
            </div>

            <div className="modal-actions">
              <IonButton expand="block" onClick={onSubmit}>
                Confirmer la programmation
                <IonIcon slot="end" icon={checkmarkCircleOutline} />
              </IonButton>
            </div>
          </div>
        ) : (
          <div className="confirmation-form">
            <div className="confirmation-summary">
              <h3>Détails du virement</h3>
              <div className="summary-item">
                <span>Compte source:</span>
                <span>{selectedAccount?.label || "-"}</span>
              </div>
              <div className="summary-item">
                <span>Bénéficiaire:</span>
                <span>{selectedBeneficiary?.name || "Non sélectionné"}</span>
              </div>
              <div className="summary-item">
                <span>Compte bénéficiaire:</span>
                <span>{selectedBeneficiary?.accountNumber || "-"}</span>
              </div>
              <div className="summary-item">
                <span>Montant:</span>
                <span className="amount">{transfer.amount || "0"} DT</span>
              </div>
              <div className="summary-item">
                <span>Motif:</span>
                <span>{transfer.reason || "Non spécifié"}</span>
              </div>
              <div className="summary-item">
                <span>Date d'exécution:</span>
                <span>
                  {new Date(transfer.date).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="confirmation-details">
              <IonItem>
                <IonLabel>Programmer une récurrence?</IonLabel>
                <IonToggle
                  checked={isRecurring}
                  onIonChange={(e) => onToggleRecurring(e.detail.checked)}
                />
              </IonItem>
            </div>

            <div className="modal-actions">
              <IonButton expand="block" onClick={onSubmit}>
                Confirmer le virement
                <IonIcon slot="end" icon={checkmarkCircleOutline} />
              </IonButton>
            </div>
          </div>
        )}
      </IonContent>
    </>
  );
};

export default TransferModal;
