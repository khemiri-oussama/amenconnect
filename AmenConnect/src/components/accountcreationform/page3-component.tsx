import React from "react";
import type { FormData } from "./types";

interface Page3Props {
  formData: FormData;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
  handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formErrors: string[];
}

const Page3Component: React.FC<Page3Props> = ({
  formData,
  handleInputChange,
  handleCheckboxChange,
  formErrors,
}) => {
  return (
    <section className="acf-form-section">
      <h3 className="acf-section-title">Produits et Services</h3>
      <div className="acf-form-row">
        <div className="acf-form-field">
          <label htmlFor="typeCompte">Type de compte</label>
          <select
            id="typeCompte"
            name="typeCompte"
            value={formData.typeCompte}
            onChange={handleInputChange}
          >
            <option value="">Sélectionner</option>
            <option value="Compte de dépot">Compte de dépôt</option>
            <option value="Compte d'épargne">Compte d'épargne</option>
            <option value="Compte courant">Compte courant</option>
            <option value="Compte titres">Compte titres</option>
            <option value="Compte à terme">Compte à terme</option>
          </select>
        </div>
        <div className="acf-form-field">
          <label htmlFor="agenceContact">Agence de contact</label>
          <select
            id="agenceContact"
            name="agenceContact"
            value={formData.agenceContact}
            onChange={handleInputChange}
          >
            <option value="">Sélectionner</option>
            <option value="AGENCE AIN ZAGHOUAN">AGENCE AIN ZAGHOUAN</option>
            <option value="AGENCE ARIANA">AGENCE ARIANA</option>
            <option value="AGENCE CENTRE URBAIN NORD">
              AGENCE CENTRE URBAIN NORD
            </option>
            <option value="AGENCE LA MARSA">AGENCE LA MARSA</option>
            <option value="AGENCE LE KRAM">AGENCE LE KRAM</option>
            <option value="AGENCE SFAX">AGENCE SFAX</option>
            <option value="AGENCE SOUSSE">AGENCE SOUSSE</option>
            <option value="AGENCE TUNIS">AGENCE TUNIS</option>
          </select>
        </div>
      </div>

      {/* New section for Credit Card Option */}
      <div className="acf-form-row">
        <div className="acf-form-field-checkbox">
          <label className="acf-checkbox-label">
            <input
              type="checkbox"
              name="wantCreditCard"
              checked={formData.wantCreditCard || false}
              onChange={handleCheckboxChange}
            />
            <span className="acf-checkbox-text">
              Je souhaite associer une carte bancaire à mon compte
            </span>
          </label>
        </div>
      </div>

      {formData.wantCreditCard && (
        <div className="acf-form-row">
          <div className="acf-form-field">
            <label htmlFor="creditCardType">
              Choisissez le type de carte bancaire
            </label>
            <select
              id="creditCardType"
              name="creditCardType"
              value={formData.creditCardType || ""}
              onChange={handleInputChange}
            >
              <option value="">Sélectionner</option>
              <option value="Carte Amen White AMV">
                Carte Amen White AMV
              </option>
              <option value="CTI Amen">CTI Amen</option>
              <option value="Autre">Autre</option>
            </select>
          </div>
        </div>
      )}

      <div className="acf-information-box">
        <h4>Services associés au compte</h4>
        <ul>
          <li>Carte bancaire (selon conditions d'éligibilité)</li>
          <li>Services digitaux (e-banking, m-banking)</li>
          <li>Alertes SMS</li>
          <li>Relevé électronique</li>
        </ul>
      </div>

      <div className="acf-form-row">
        <div className="acf-form-field-radio">
          <label className="acf-checkbox-label">
            <input
              type="checkbox"
              name="acceptConditions"
              checked={formData.acceptConditions}
              onChange={handleCheckboxChange}
            />
            <span className="acf-checkbox-text">
              J'accepte les conditions générales d'ouverture et de fonctionnement
              de compte
            </span>
          </label>
        </div>
      </div>

      <div className="acf-terms-section">
        <div className="acf-terms-content">
          <p>
            <strong>
              CONDITIONS GÉNÉRALES D'OUVERTURE ET DE FONCTIONNEMENT DE COMPTE
            </strong>
          </p>
          <p>
            Les présentes conditions générales régissent les relations entre AMEN
            FIRST BANK et son Client. Elles constituent un contrat entre les parties
            et sont complétées par des conventions particulières qui peuvent être
            conclues par acte séparé pour chaque produit ou service fourni par la
            Banque.
          </p>
          <p>
            Le Client s'engage à respecter les dispositions légales et réglementaires
            en vigueur notamment en matière de lutte contre le blanchiment d'argent et
            le financement du terrorisme.
          </p>
          <p>
            Le Client s'engage également à communiquer à la Banque toute pièce
            justificative afférente aux opérations qu'il effectue sur ses comptes.
          </p>
          <p>
            La Banque se réserve le droit de modifier unilatéralement les présentes
            conditions générales, les modifications seront portées à la connaissance du
            Client par tout moyen.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Page3Component;
