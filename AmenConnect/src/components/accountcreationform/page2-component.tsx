import type React from "react"
import type { FormData } from "./types"

interface Page2Props {
  formData: FormData
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
  handleRadioChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleNestedInputChange: (category: keyof FormData, field: string, value: string) => void
  formErrors: string[]
}

const Page2Component: React.FC<Page2Props> = ({
  formData,
  handleInputChange,
  handleRadioChange,
  handleCheckboxChange,
  handleNestedInputChange,
  formErrors,
}) => {
  return (
    <>
      <section className="acf-form-section">
        <h3 className="acf-section-title">Informations Complémentaires</h3>
        <div className="acf-form-row">
          <div className="acf-form-field">
            <label htmlFor="connuAmenBank">Comment avez-vous connu AMEN FIRST BANK?</label>
            <select id="connuAmenBank" name="connuAmenBank" value={formData.connuAmenBank} onChange={handleInputChange}>
              <option value="">Sélectionner</option>
              <option value="Internet">Internet</option>
              <option value="Presse">Presse</option>
              <option value="Radio">Radio</option>
              <option value="TV">TV</option>
              <option value="Affichage">Affichage</option>
              <option value="Recommandation">Recommandation</option>
              <option value="Autre">Autre</option>
            </select>
          </div>
        </div>

        {formData.connuAmenBank === "Autre" && (
          <div className="acf-form-row">
            <div className="acf-form-field">
              <label htmlFor="connuAmenBankAutre">Précisez:</label>
              <input
                type="text"
                id="connuAmenBankAutre"
                name="connuAmenBankAutre"
                value={formData.connuAmenBankAutre}
                onChange={handleInputChange}
              />
            </div>
          </div>
        )}
      </section>

      <section className="acf-form-section">
        <h3 className="acf-section-title">Fonctions Spéciales</h3>

        <div className="acf-form-row">
          <div className="acf-form-field-radio">
            <label>Exercez-vous ou avez-vous exercé une haute fonction?</label>
            <div className="acf-radio-group">
              <label className="acf-radio-label">
                <input
                  type="radio"
                  name="exerceHauteFonction"
                  value="OUI"
                  checked={formData.exerceHauteFonction === "OUI"}
                  onChange={handleRadioChange}
                />
                <span className="acf-radio-text">Oui</span>
              </label>
              <label className="acf-radio-label">
                <input
                  type="radio"
                  name="exerceHauteFonction"
                  value="NON"
                  checked={formData.exerceHauteFonction === "NON"}
                  onChange={handleRadioChange}
                />
                <span className="acf-radio-text">Non</span>
              </label>
            </div>
          </div>
        </div>

        {formData.exerceHauteFonction === "OUI" && (
          <div className="acf-form-row">
            <div className="acf-form-field">
              <label htmlFor="exerceHauteFonctionDetail.fonction">Fonction</label>
              <input
                type="text"
                id="exerceHauteFonctionDetail.fonction"
                name="exerceHauteFonctionDetail.fonction"
                value={formData.exerceHauteFonctionDetail.fonction}
                onChange={(e) => handleNestedInputChange("exerceHauteFonctionDetail", "fonction", e.target.value)}
              />
            </div>
            <div className="acf-form-field">
              <label htmlFor="exerceHauteFonctionDetail.organisme">Organisme</label>
              <input
                type="text"
                id="exerceHauteFonctionDetail.organisme"
                name="exerceHauteFonctionDetail.organisme"
                value={formData.exerceHauteFonctionDetail.organisme}
                onChange={(e) => handleNestedInputChange("exerceHauteFonctionDetail", "organisme", e.target.value)}
              />
            </div>
          </div>
        )}

        <div className="acf-form-row">
          <div className="acf-form-field-radio">
            <label>Êtes-vous lié à une personne exerçant une haute fonction?</label>
            <div className="acf-radio-group">
              <label className="acf-radio-label">
                <input
                  type="radio"
                  name="liePersonneHauteFonction"
                  value="OUI"
                  checked={formData.liePersonneHauteFonction === "OUI"}
                  onChange={handleRadioChange}
                />
                <span className="acf-radio-text">Oui</span>
              </label>
              <label className="acf-radio-label">
                <input
                  type="radio"
                  name="liePersonneHauteFonction"
                  value="NON"
                  checked={formData.liePersonneHauteFonction === "NON"}
                  onChange={handleRadioChange}
                />
                <span className="acf-radio-text">Non</span>
              </label>
            </div>
          </div>
        </div>

        {formData.liePersonneHauteFonction === "OUI" && (
          <div className="acf-form-row">
            <div className="acf-form-field">
              <label htmlFor="liePersonneHauteFonctionDetail.fonction">Fonction</label>
              <input
                type="text"
                id="liePersonneHauteFonctionDetail.fonction"
                name="liePersonneHauteFonctionDetail.fonction"
                value={formData.liePersonneHauteFonctionDetail.fonction}
                onChange={(e) => handleNestedInputChange("liePersonneHauteFonctionDetail", "fonction", e.target.value)}
              />
            </div>
            <div className="acf-form-field">
              <label htmlFor="liePersonneHauteFonctionDetail.organisme">Organisme</label>
              <input
                type="text"
                id="liePersonneHauteFonctionDetail.organisme"
                name="liePersonneHauteFonctionDetail.organisme"
                value={formData.liePersonneHauteFonctionDetail.organisme}
                onChange={(e) => handleNestedInputChange("liePersonneHauteFonctionDetail", "organisme", e.target.value)}
              />
            </div>
            <div className="acf-form-field">
              <label htmlFor="liePersonneHauteFonctionDetail.nomPrenom">Nom & Prénom</label>
              <input
                type="text"
                id="liePersonneHauteFonctionDetail.nomPrenom"
                name="liePersonneHauteFonctionDetail.nomPrenom"
                value={formData.liePersonneHauteFonctionDetail.nomPrenom}
                onChange={(e) => handleNestedInputChange("liePersonneHauteFonctionDetail", "nomPrenom", e.target.value)}
              />
            </div>
          </div>
        )}

        <div className="acf-form-row">
          <div className="acf-form-field-radio">
            <label>Êtes-vous fonctionnaire d'une organisation internationale?</label>
            <div className="acf-radio-group">
              <label className="acf-radio-label">
                <input
                  type="radio"
                  name="fonctionnaireOrganisationInternationale"
                  value="OUI"
                  checked={formData.fonctionnaireOrganisationInternationale === "OUI"}
                  onChange={handleRadioChange}
                />
                <span className="acf-radio-text">Oui</span>
              </label>
              <label className="acf-radio-label">
                <input
                  type="radio"
                  name="fonctionnaireOrganisationInternationale"
                  value="NON"
                  checked={formData.fonctionnaireOrganisationInternationale === "NON"}
                  onChange={handleRadioChange}
                />
                <span className="acf-radio-text">Non</span>
              </label>
            </div>
          </div>
        </div>

        {formData.fonctionnaireOrganisationInternationale === "OUI" && (
          <div className="acf-form-row">
            <div className="acf-form-field">
              <label htmlFor="fonctionnaireOrganisationInternationaleDetail.fonction">Fonction</label>
              <input
                type="text"
                id="fonctionnaireOrganisationInternationaleDetail.fonction"
                name="fonctionnaireOrganisationInternationaleDetail.fonction"
                value={formData.fonctionnaireOrganisationInternationaleDetail.fonction}
                onChange={(e) =>
                  handleNestedInputChange("fonctionnaireOrganisationInternationaleDetail", "fonction", e.target.value)
                }
              />
            </div>
            <div className="acf-form-field">
              <label htmlFor="fonctionnaireOrganisationInternationaleDetail.organisme">Organisme</label>
              <input
                type="text"
                id="fonctionnaireOrganisationInternationaleDetail.organisme"
                name="fonctionnaireOrganisationInternationaleDetail.organisme"
                value={formData.fonctionnaireOrganisationInternationaleDetail.organisme}
                onChange={(e) =>
                  handleNestedInputChange("fonctionnaireOrganisationInternationaleDetail", "organisme", e.target.value)
                }
              />
            </div>
          </div>
        )}
      </section>

      <section className="acf-form-section">
        <h3 className="acf-section-title">Types de Revenus</h3>

        <div className="acf-form-row">
          <div className="acf-checkbox-group">
            <label className="acf-checkbox-label">
              <input
                type="checkbox"
                name="revenusTypes.salaires"
                checked={formData.revenusTypes.salaires}
                onChange={handleCheckboxChange}
              />
              <span className="acf-checkbox-text">Salaires</span>
            </label>
            <label className="acf-checkbox-label">
              <input
                type="checkbox"
                name="revenusTypes.honoraires"
                checked={formData.revenusTypes.honoraires}
                onChange={handleCheckboxChange}
              />
              <span className="acf-checkbox-text">Honoraires</span>
            </label>
            <label className="acf-checkbox-label">
              <input
                type="checkbox"
                name="revenusTypes.loyers"
                checked={formData.revenusTypes.loyers}
                onChange={handleCheckboxChange}
              />
              <span className="acf-checkbox-text">Loyers</span>
            </label>
            <label className="acf-checkbox-label">
              <input
                type="checkbox"
                name="revenusTypes.pensions"
                checked={formData.revenusTypes.pensions}
                onChange={handleCheckboxChange}
              />
              <span className="acf-checkbox-text">Pensions</span>
            </label>
            <label className="acf-checkbox-label">
              <input
                type="checkbox"
                name="revenusTypes.revenusAvoirs"
                checked={formData.revenusTypes.revenusAvoirs}
                onChange={handleCheckboxChange}
              />
              <span className="acf-checkbox-text">Revenus d'avoirs</span>
            </label>
            <label className="acf-checkbox-label">
              <input
                type="checkbox"
                name="revenusTypes.autres"
                checked={formData.revenusTypes.autres}
                onChange={handleCheckboxChange}
              />
              <span className="acf-checkbox-text">Autres</span>
            </label>
          </div>
        </div>

        <div className="acf-form-row">
          <div className="acf-form-field">
            <label htmlFor="montantRevenusAnnuels">Montant approximatif des revenus annuels</label>
            <select
              id="montantRevenusAnnuels"
              name="montantRevenusAnnuels"
              value={formData.montantRevenusAnnuels}
              onChange={handleInputChange}
            >
              <option value="">Sélectionner</option>
              <option value="< 5.000 DT">&lt; 5.000 DT</option>
              <option value="5.000 - 10.000 DT">5.000 - 10.000 DT</option>
              <option value="10.000 - 30.000 DT">10.000 - 30.000 DT</option>
              <option value="30.000 - 50.000 DT">30.000 - 50.000 DT</option>
              <option value="50.000 - 100.000 DT">50.000 - 100.000 DT</option>
              <option value="> 100.000 DT">&gt; 100.000 DT</option>
            </select>
          </div>
          <div className="acf-form-field">
            <label htmlFor="montantRevenusMensuels">Montant approximatif des revenus mensuels</label>
            <select
              id="montantRevenusMensuels"
              name="montantRevenusMensuels"
              value={formData.montantRevenusMensuels}
              onChange={handleInputChange}
            >
              <option value="">Sélectionner</option>
              <option value="< 500 DT">&lt; 500 DT</option>
              <option value="500 - 1.000 DT">500 - 1.000 DT</option>
              <option value="1.000 - 2.000 DT">1.000 - 2.000 DT</option>
              <option value="2.000 - 5.000 DT">2.000 - 5.000 DT</option>
              <option value="5.000 - 10.000 DT">5.000 - 10.000 DT</option>
              <option value="> 10.000 DT">&gt; 10.000 DT</option>
            </select>
          </div>
        </div>
      </section>

      <section className="acf-form-section">
        <h3 className="acf-section-title">Relation d'affaires</h3>
        <div className="acf-form-row">
          <div className="acf-form-field">
            <label>Objet de l'ouverture du compte</label>
            <div className="acf-checkbox-group">
              <label className="acf-checkbox-label">
                <input
                  type="checkbox"
                  name="objetOuvertureCompte.domiciliationSalaires"
                  checked={formData.objetOuvertureCompte.domiciliationSalaires}
                  onChange={handleCheckboxChange}
                />
                <span className="acf-checkbox-text">Domiciliation des salaires</span>
              </label>
              <label className="acf-checkbox-label">
                <input
                  type="checkbox"
                  name="objetOuvertureCompte.placements"
                  checked={formData.objetOuvertureCompte.placements}
                  onChange={handleCheckboxChange}
                />
                <span className="acf-checkbox-text">Placements</span>
              </label>
              <label className="acf-checkbox-label">
                <input
                  type="checkbox"
                  name="objetOuvertureCompte.investissementsMarchesFinanciers"
                  checked={formData.objetOuvertureCompte.investissementsMarchesFinanciers}
                  onChange={handleCheckboxChange}
                />
                <span className="acf-checkbox-text">Investissements sur les marchés financiers</span>
              </label>
              <label className="acf-checkbox-label">
                <input
                  type="checkbox"
                  name="objetOuvertureCompte.credits"
                  checked={formData.objetOuvertureCompte.credits}
                  onChange={handleCheckboxChange}
                />
                <span className="acf-checkbox-text">Crédits</span>
              </label>
              <label className="acf-checkbox-label">
                <input
                  type="checkbox"
                  name="objetOuvertureCompte.activiteCommerciale"
                  checked={formData.objetOuvertureCompte.activiteCommerciale}
                  onChange={handleCheckboxChange}
                />
                <span className="acf-checkbox-text">Activité commerciale</span>
              </label>
              <label className="acf-checkbox-label">
                <input
                  type="checkbox"
                  name="objetOuvertureCompte.autre"
                  checked={formData.objetOuvertureCompte.autre}
                  onChange={handleCheckboxChange}
                />
                <span className="acf-checkbox-text">Autre</span>
              </label>
            </div>
          </div>
        </div>

        {formData.objetOuvertureCompte.autre && (
          <div className="acf-form-row">
            <div className="acf-form-field">
              <label htmlFor="objetOuvertureCompteAutre">Précisez:</label>
              <input
                type="text"
                id="objetOuvertureCompteAutre"
                name="objetOuvertureCompteAutre"
                value={formData.objetOuvertureCompteAutre}
                onChange={handleInputChange}
              />
            </div>
          </div>
        )}
      </section>

      <section className="acf-form-section">
        <h3 className="acf-section-title">Transactions envisagées</h3>
        <div className="acf-form-row">
          <div className="acf-form-field">
            <label>Types de transactions envisagées</label>
            <div className="acf-checkbox-group">
              <label className="acf-checkbox-label">
                <input
                  type="checkbox"
                  name="transactionsEnvisagees.operationsCourantes"
                  checked={formData.transactionsEnvisagees.operationsCourantes}
                  onChange={handleCheckboxChange}
                />
                <span className="acf-checkbox-text">Opérations courantes</span>
              </label>
              <label className="acf-checkbox-label">
                <input
                  type="checkbox"
                  name="transactionsEnvisagees.transfertsCommerciaux"
                  checked={formData.transactionsEnvisagees.transfertsCommerciaux}
                  onChange={handleCheckboxChange}
                />
                <span className="acf-checkbox-text">Transferts commerciaux</span>
              </label>
              <label className="acf-checkbox-label">
                <input
                  type="checkbox"
                  name="transactionsEnvisagees.transfertsFinanciers"
                  checked={formData.transactionsEnvisagees.transfertsFinanciers}
                  onChange={handleCheckboxChange}
                />
                <span className="acf-checkbox-text">Transferts financiers</span>
              </label>
              <label className="acf-checkbox-label">
                <input
                  type="checkbox"
                  name="transactionsEnvisagees.epargneDepot"
                  checked={formData.transactionsEnvisagees.epargneDepot}
                  onChange={handleCheckboxChange}
                />
                <span className="acf-checkbox-text">Épargne/Dépôt</span>
              </label>
              <label className="acf-checkbox-label">
                <input
                  type="checkbox"
                  name="transactionsEnvisagees.credits"
                  checked={formData.transactionsEnvisagees.credits}
                  onChange={handleCheckboxChange}
                />
                <span className="acf-checkbox-text">Crédits</span>
              </label>
              <label className="acf-checkbox-label">
                <input
                  type="checkbox"
                  name="transactionsEnvisagees.titres"
                  checked={formData.transactionsEnvisagees.titres}
                  onChange={handleCheckboxChange}
                />
                <span className="acf-checkbox-text">Titres</span>
              </label>
            </div>
          </div>
        </div>

        <div className="acf-form-row">
          <div className="acf-form-field">
            <label htmlFor="volumeMensuelTransaction">Volume mensuel de transaction</label>
            <select
              id="volumeMensuelTransaction"
              name="volumeMensuelTransaction"
              value={formData.volumeMensuelTransaction}
              onChange={handleInputChange}
            >
              <option value="">Sélectionner</option>
              <option value="< 5.000 DT">&lt; 5.000 DT</option>
              <option value="5.000 - 10.000 DT">5.000 - 10.000 DT</option>
              <option value="10.000 - 50.000 DT">10.000 - 50.000 DT</option>
              <option value="50.000 - 100.000 DT">50.000 - 100.000 DT</option>
              <option value="> 100.000 DT">&gt; 100.000 DT</option>
            </select>
          </div>
        </div>
      </section>
    </>
  )
}

export default Page2Component

