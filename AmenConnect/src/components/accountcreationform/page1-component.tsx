import type React from "react"
import type { FormData } from "./types"

interface Page1Props {
  formData: FormData
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
  handleRadioChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  formErrors: string[]
}

const Page1Component: React.FC<Page1Props> = ({ formData, handleInputChange, handleRadioChange, formErrors }) => {
  return (
    <section className="acf-form-section">
      <h3 className="acf-section-title">Informations Personnelles</h3>
      <div className="acf-form-row">
        <div className="acf-form-field">
          <label htmlFor="nom">
            Nom<span className="required">**</span>
          </label>
          <input type="text" id="nom" name="nom" value={formData.nom} onChange={handleInputChange} required />
        </div>
        <div className="acf-form-field">
          <label htmlFor="prenom">
            Prénom<span className="required">**</span>
          </label>
          <input type="text" id="prenom" name="prenom" value={formData.prenom} onChange={handleInputChange} required />
        </div>
      </div>

      <div className="acf-form-row">
        <div className="acf-form-field">
          <label htmlFor="dateNaissance">
            Date de naissance<span className="required">**</span>
          </label>
          <input
            type="date"
            id="dateNaissance"
            name="dateNaissance"
            value={formData.dateNaissance}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="acf-form-field">
          <label htmlFor="lieuNaissance">
            Lieu de naissance<span className="required">**</span>
          </label>
          <input
            type="text"
            id="lieuNaissance"
            name="lieuNaissance"
            value={formData.lieuNaissance}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      <div className="acf-form-row">
        <div className="acf-form-field">
          <label htmlFor="numeroCIN">
            Numéro CIN<span className="required">**</span>
          </label>
          <input
            type="text"
            id="numeroCIN"
            name="numeroCIN"
            value={formData.numeroCIN}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="acf-form-field">
          <label htmlFor="dateDelivranceCIN">
            Date de délivrance CIN<span className="required">**</span>
          </label>
          <input
            type="date"
            id="dateDelivranceCIN"
            name="dateDelivranceCIN"
            value={formData.dateDelivranceCIN}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="acf-form-field">
          <label htmlFor="lieuDelivranceCIN">
            Lieu de délivrance CIN<span className="required">**</span>
          </label>
          <input
            type="text"
            id="lieuDelivranceCIN"
            name="lieuDelivranceCIN"
            value={formData.lieuDelivranceCIN}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      <div className="acf-form-row">
        <div className="acf-form-field">
          <label htmlFor="qualiteJuridique">Qualité juridique</label>
          <select
            id="qualiteJuridique"
            name="qualiteJuridique"
            value={formData.qualiteJuridique}
            onChange={handleInputChange}
          >
            <option value="">Sélectionner</option>
            <option value="Majeur">Majeur</option>
            <option value="Mineur">Mineur</option>
            <option value="Interdit">Interdit</option>
          </select>
        </div>
        <div className="acf-form-field">
          <label htmlFor="situationFamille">
            Situation de famille<span className="required">**</span>
          </label>
          <select
            id="situationFamille"
            name="situationFamille"
            value={formData.situationFamille}
            onChange={handleInputChange}
            required
          >
            <option value="Célibataire">Célibataire</option>
            <option value="Marié(e)">Marié(e)</option>
            <option value="Divorcé(e)">Divorcé(e)</option>
            <option value="Veuf(ve)">Veuf(ve)</option>
          </select>
        </div>
      </div>

      <div className="acf-form-row">
        <div className="acf-form-field">
          <label htmlFor="email">
            Email<span className="required">**</span>
          </label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required />
        </div>
        <div className="acf-form-field">
          <label htmlFor="numeroGSM">
            Numéro GSM<span className="required">**</span>
          </label>
          <input
            type="tel"
            id="numeroGSM"
            name="numeroGSM"
            value={formData.numeroGSM}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      <div className="acf-form-row">
        <div className="acf-form-field">
          <label htmlFor="adresseDomicile">
            Adresse domicile<span className="required">**</span>
          </label>
          <input
            type="text"
            id="adresseDomicile"
            name="adresseDomicile"
            value={formData.adresseDomicile}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      <div className="acf-form-row">
        <div className="acf-form-field">
          <label htmlFor="codePostal">Code postal</label>
          <input
            type="text"
            id="codePostal"
            name="codePostal"
            value={formData.codePostal}
            onChange={handleInputChange}
          />
        </div>
        <div className="acf-form-field">
          <label htmlFor="ville">Ville</label>
          <input type="text" id="ville" name="ville" value={formData.ville} onChange={handleInputChange} />
        </div>
      </div>

      <h3 className="acf-subsection-title">Activité</h3>
      <div className="acf-form-row">
        <div className="acf-form-field">
          <label htmlFor="activite">Activité</label>
          <select id="activite" name="activite" value={formData.activite} onChange={handleInputChange}>
            <option value="Elève/étudiant">Elève/étudiant</option>
            <option value="Salarié">Salarié</option>
            <option value="Profession libérale">Profession libérale</option>
            <option value="Retraité">Retraité</option>
            <option value="Sans emploi">Sans emploi</option>
          </select>
        </div>
        <div className="acf-form-field">
          <label htmlFor="fonction">Fonction</label>
          <input type="text" id="fonction" name="fonction" value={formData.fonction} onChange={handleInputChange} />
        </div>
      </div>

      <h3 className="acf-subsection-title">FATCA</h3>
      <div className="acf-form-row">
        <div className="acf-form-field-radio">
          <label>Êtes-vous soumis à FATCA?</label>
          <div className="acf-radio-group">
            <label className="acf-radio-label">
              <input
                type="radio"
                name="fatca"
                value="oui"
                checked={formData.fatca === "oui"}
                onChange={handleRadioChange}
              />
              <span className="acf-radio-text">Oui</span>
            </label>
            <label className="acf-radio-label">
              <input
                type="radio"
                name="fatca"
                value="non"
                checked={formData.fatca === "non"}
                onChange={handleRadioChange}
              />
              <span className="acf-radio-text">Non</span>
            </label>
          </div>
        </div>
      </div>

      {formData.fatca === "oui" && (
        <div className="acf-information-box">
          <h4>Informations FATCA supplémentaires</h4>
          <div className="acf-form-row">
            <div className="acf-form-field-radio">
              <label>Citoyenneté américaine</label>
              <div className="acf-radio-group">
                <label className="acf-radio-label">
                  <input
                    type="radio"
                    name="citoyenneteAmericaine"
                    value="OUI"
                    checked={formData.citoyenneteAmericaine === "OUI"}
                    onChange={handleRadioChange}
                  />
                  <span className="acf-radio-text">Oui</span>
                </label>
                <label className="acf-radio-label">
                  <input
                    type="radio"
                    name="citoyenneteAmericaine"
                    value="NON"
                    checked={formData.citoyenneteAmericaine === "NON"}
                    onChange={handleRadioChange}
                  />
                  <span className="acf-radio-text">Non</span>
                </label>
              </div>
            </div>
          </div>

          <div className="acf-form-row">
            <div className="acf-form-field">
              <label htmlFor="pays">Pays</label>
              <input type="text" id="pays" name="pays" value={formData.pays} onChange={handleInputChange} />
            </div>
          </div>

          <div className="acf-form-row">
            <div className="acf-form-field-radio">
              <label>Détention d'un code TIN</label>
              <div className="acf-radio-group">
                <label className="acf-radio-label">
                  <input
                    type="radio"
                    name="detentionCodeTIN"
                    value="OUI"
                    checked={formData.detentionCodeTIN === "OUI"}
                    onChange={handleRadioChange}
                  />
                  <span className="acf-radio-text">Oui</span>
                </label>
                <label className="acf-radio-label">
                  <input
                    type="radio"
                    name="detentionCodeTIN"
                    value="NON"
                    checked={formData.detentionCodeTIN === "NON"}
                    onChange={handleRadioChange}
                  />
                  <span className="acf-radio-text">Non</span>
                </label>
              </div>
            </div>
          </div>

          {formData.detentionCodeTIN === "OUI" && (
            <div className="acf-form-row">
              <div className="acf-form-field">
                <label htmlFor="codeTIN">Code TIN</label>
                <input type="text" id="codeTIN" name="codeTIN" value={formData.codeTIN} onChange={handleInputChange} />
              </div>
            </div>
          )}

          <div className="acf-form-row">
            <div className="acf-form-field-radio">
              <label>Ligne téléphonique aux USA</label>
              <div className="acf-radio-group">
                <label className="acf-radio-label">
                  <input
                    type="radio"
                    name="ligneTelephoniqueUSA"
                    value="OUI"
                    checked={formData.ligneTelephoniqueUSA === "OUI"}
                    onChange={handleRadioChange}
                  />
                  <span className="acf-radio-text">Oui</span>
                </label>
                <label className="acf-radio-label">
                  <input
                    type="radio"
                    name="ligneTelephoniqueUSA"
                    value="NON"
                    checked={formData.ligneTelephoniqueUSA === "NON"}
                    onChange={handleRadioChange}
                  />
                  <span className="acf-radio-text">Non</span>
                </label>
              </div>
            </div>
          </div>

          <div className="acf-form-row">
            <div className="acf-form-field-radio">
              <label>Détention d'une Green Card</label>
              <div className="acf-radio-group">
                <label className="acf-radio-label">
                  <input
                    type="radio"
                    name="detentionGreenCard"
                    value="OUI"
                    checked={formData.detentionGreenCard === "OUI"}
                    onChange={handleRadioChange}
                  />
                  <span className="acf-radio-text">Oui</span>
                </label>
                <label className="acf-radio-label">
                  <input
                    type="radio"
                    name="detentionGreenCard"
                    value="NON"
                    checked={formData.detentionGreenCard === "NON"}
                    onChange={handleRadioChange}
                  />
                  <span className="acf-radio-text">Non</span>
                </label>
              </div>
            </div>
          </div>

          <div className="acf-form-row">
            <div className="acf-form-field-radio">
              <label>Adresse postale aux USA</label>
              <div className="acf-radio-group">
                <label className="acf-radio-label">
                  <input
                    type="radio"
                    name="adressePostaleUSA"
                    value="OUI"
                    checked={formData.adressePostaleUSA === "OUI"}
                    onChange={handleRadioChange}
                  />
                  <span className="acf-radio-text">Oui</span>
                </label>
                <label className="acf-radio-label">
                  <input
                    type="radio"
                    name="adressePostaleUSA"
                    value="NON"
                    checked={formData.adressePostaleUSA === "NON"}
                    onChange={handleRadioChange}
                  />
                  <span className="acf-radio-text">Non</span>
                </label>
              </div>
            </div>
          </div>

          <div className="acf-form-row">
            <div className="acf-form-field-radio">
              <label>Virement permanent vers les USA</label>
              <div className="acf-radio-group">
                <label className="acf-radio-label">
                  <input
                    type="radio"
                    name="virementPermanentUSA"
                    value="OUI"
                    checked={formData.virementPermanentUSA === "OUI"}
                    onChange={handleRadioChange}
                  />
                  <span className="acf-radio-text">Oui</span>
                </label>
                <label className="acf-radio-label">
                  <input
                    type="radio"
                    name="virementPermanentUSA"
                    value="NON"
                    checked={formData.virementPermanentUSA === "NON"}
                    onChange={handleRadioChange}
                  />
                  <span className="acf-radio-text">Non</span>
                </label>
              </div>
            </div>
          </div>

          <div className="acf-form-row">
            <div className="acf-form-field-radio">
              <label>Procuration à personne ayant une adresse aux USA</label>
              <div className="acf-radio-group">
                <label className="acf-radio-label">
                  <input
                    type="radio"
                    name="procurationPersonneUSA"
                    value="OUI"
                    checked={formData.procurationPersonneUSA === "OUI"}
                    onChange={handleRadioChange}
                  />
                  <span className="acf-radio-text">Oui</span>
                </label>
                <label className="acf-radio-label">
                  <input
                    type="radio"
                    name="procurationPersonneUSA"
                    value="NON"
                    checked={formData.procurationPersonneUSA === "NON"}
                    onChange={handleRadioChange}
                  />
                  <span className="acf-radio-text">Non</span>
                </label>
              </div>
            </div>
          </div>

          <div className="acf-form-row">
            <div className="acf-form-field-radio">
              <label>Détention d'une société américaine</label>
              <div className="acf-radio-group">
                <label className="acf-radio-label">
                  <input
                    type="radio"
                    name="detentionSocieteAmericaine"
                    value="OUI"
                    checked={formData.detentionSocieteAmericaine === "OUI"}
                    onChange={handleRadioChange}
                  />
                  <span className="acf-radio-text">Oui</span>
                </label>
                <label className="acf-radio-label">
                  <input
                    type="radio"
                    name="detentionSocieteAmericaine"
                    value="NON"
                    checked={formData.detentionSocieteAmericaine === "NON"}
                    onChange={handleRadioChange}
                  />
                  <span className="acf-radio-text">Non</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default Page1Component

