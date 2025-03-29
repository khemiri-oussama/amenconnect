"use client"
import { useState, useEffect } from "react"
import type React from "react"
import { IonIcon } from "@ionic/react"
import {
  peopleOutline,
  personAddOutline,
  personRemoveOutline,
  createOutline,
  checkmarkCircleOutline,
  closeCircleOutline,
  searchOutline,
} from "ionicons/icons"
import { useBeneficiaries, Beneficiaire } from "../../../hooks/useBeneficiaries" // adjust the path as needed

const GestionBeneficiaires: React.FC = () => {
  const {
    beneficiaires,
    loading,
    error,
    addBeneficiaire,
    updateBeneficiaire,
    deleteBeneficiaire,
    fetchBeneficiaires,
  } = useBeneficiaries()

  const [filteredBeneficiaires, setFilteredBeneficiaires] = useState<Beneficiaire[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  // Form states
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    numeroCompte: "",
    banque: "",
    email: "",
    telephone: "",
  })
  const [formError, setFormError] = useState("")
  const [formSuccess, setFormSuccess] = useState("")

  // Filter beneficiaries when they change or searchTerm updates
  useEffect(() => {
    if (searchTerm) {
      const filtered = beneficiaires.filter(
        (ben) =>
          ben.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ben.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ben.numeroCompte.includes(searchTerm) ||
          ben.banque.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredBeneficiaires(filtered)
    } else {
      setFilteredBeneficiaires(beneficiaires)
    }
  }, [beneficiaires, searchTerm])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddBeneficiaire = () => {
    setEditingId(null)
    setFormData({
      prenom: "",
      nom: "",
      numeroCompte: "",
      banque: "",
      email: "",
      telephone: "",
    })
    setFormError("")
    setFormSuccess("")
    setShowForm(true)
  }

  const handleEditBeneficiaire = (id: string) => {
    const beneficiaire = beneficiaires.find((ben) => ben._id === id)
    if (beneficiaire) {
      setEditingId(id)
      setFormData({
        prenom: beneficiaire.prenom,
        nom: beneficiaire.nom,
        numeroCompte: beneficiaire.numeroCompte,
        banque: beneficiaire.banque,
        email: beneficiaire.email || "",
        telephone: beneficiaire.telephone || "",
      })
      setFormError("")
      setFormSuccess("")
      setShowForm(true)
    }
  }

  const handleDeleteBeneficiaire = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce bénéficiaire ?")) {
      try {
        await deleteBeneficiaire(id)
        setFormSuccess("Bénéficiaire supprimé avec succès")
        setTimeout(() => setFormSuccess(""), 3000)
      } catch (error: any) {
        console.error("Error deleting beneficiary:", error)
        setFormError(error.message || "Une erreur est survenue lors de la suppression du bénéficiaire")
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError("")
    setFormSuccess("")

    try {
      // Validate form
      if (!formData.prenom || !formData.nom || !formData.numeroCompte || !formData.banque) {
        throw new Error("Veuillez remplir tous les champs obligatoires")
      }

      // Validate account number format
      if (!/^TN\d{20}$/.test(formData.numeroCompte)) {
        throw new Error("Le numéro de compte doit être au format TN suivi de 20 chiffres")
      }

      if (editingId) {
        // Update existing beneficiary
        await updateBeneficiaire(editingId, formData)
        setFormSuccess("Bénéficiaire modifié avec succès")
      } else {
        // Add new beneficiary. The backend should automatically assign an _id and dateAjout.
        await addBeneficiaire(formData)
        setFormSuccess("Bénéficiaire ajouté avec succès")
      }

      // Reset form
      setFormData({
        prenom: "",
        nom: "",
        numeroCompte: "",
        banque: "",
        email: "",
        telephone: "",
      })

      // Hide form after 2 seconds
      setTimeout(() => {
        setShowForm(false)
        setEditingId(null)
        setFormSuccess("")
      }, 2000)
    } catch (error: any) {
      console.error("Error submitting form:", error)
      setFormError(error.message || "Une erreur est survenue lors de l'enregistrement du bénéficiaire")
    }
  }

  return (
    <div className="gestion-beneficiaires">
      <div className="virement-card">
        <div className="virement-card__header">
          <h3 className="virement-card__title">
            <IonIcon icon={peopleOutline} />
            Gestion des bénéficiaires
          </h3>

          <button className="virement-form__button" onClick={handleAddBeneficiaire}>
            <IonIcon icon={personAddOutline} />
            Ajouter un bénéficiaire
          </button>
        </div>

        {formSuccess && (
          <div className="virement-form__success">
            <IonIcon icon={checkmarkCircleOutline} />
            {formSuccess}
          </div>
        )}

        {showForm && (
          <div className="beneficiaire-form">
            <h4 className="beneficiaire-form__title">
              {editingId ? "Modifier le bénéficiaire" : "Ajouter un bénéficiaire"}
            </h4>

            {formError && (
              <div className="virement-form__error">
                <IonIcon icon={closeCircleOutline} />
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="virement-form__row">
                <div className="virement-form__group">
                  <label className="virement-form__label" htmlFor="prenom">
                    Prénom *
                  </label>
                  <input
                    id="prenom"
                    name="prenom"
                    type="text"
                    className="virement-form__input"
                    value={formData.prenom}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="virement-form__group">
                  <label className="virement-form__label" htmlFor="nom">
                    Nom *
                  </label>
                  <input
                    id="nom"
                    name="nom"
                    type="text"
                    className="virement-form__input"
                    value={formData.nom}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="virement-form__group">
                <label className="virement-form__label" htmlFor="numeroCompte">
                  Numéro de compte (IBAN) *
                </label>
                <input
                  id="numeroCompte"
                  name="numeroCompte"
                  type="text"
                  className="virement-form__input"
                  value={formData.numeroCompte}
                  onChange={handleInputChange}
                  placeholder="TN59..."
                  required
                />
                <div className="virement-form__hint">Format: TN suivi de 20 chiffres</div>
              </div>

              <div className="virement-form__group">
                <label className="virement-form__label" htmlFor="banque">
                  Banque *
                </label>
                <input
                  id="banque"
                  name="banque"
                  type="text"
                  className="virement-form__input"
                  value={formData.banque}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="virement-form__row">
                <div className="virement-form__group">
                  <label className="virement-form__label" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="virement-form__input"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="virement-form__group">
                  <label className="virement-form__label" htmlFor="telephone">
                    Téléphone
                  </label>
                  <input
                    id="telephone"
                    name="telephone"
                    type="tel"
                    className="virement-form__input"
                    value={formData.telephone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="virement-form__actions">
                <button
                  type="button"
                  className="virement-form__button virement-form__button--secondary"
                  onClick={() => setShowForm(false)}
                >
                  Annuler
                </button>

                <button type="submit" className="virement-form__button">
                  {editingId ? "Modifier" : "Ajouter"}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="virement-search">
          <div className="virement-search__input-container">
            <IonIcon icon={searchOutline} className="virement-search__icon" />
            <input
              type="text"
              className="virement-search__input"
              placeholder="Rechercher un bénéficiaire..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="virement-loading">Chargement des bénéficiaires...</div>
        ) : error ? (
          <div className="virement-error">{error}</div>
        ) : filteredBeneficiaires.length === 0 ? (
          <div className="virement-empty">Aucun bénéficiaire trouvé</div>
        ) : (
          <div className="beneficiaires-list">
            {filteredBeneficiaires.map((ben) => (
              <div key={ben._id} className="beneficiaire-item">
                <div className="beneficiaire-item__info">
                  <h4 className="beneficiaire-item__name">
                    {ben.prenom} {ben.nom}
                  </h4>
                  <div className="beneficiaire-item__details">
                    <div className="beneficiaire-item__detail">
                      <span className="beneficiaire-item__label">Compte:</span>
                      <span className="beneficiaire-item__value">{ben.numeroCompte}</span>
                    </div>
                    <div className="beneficiaire-item__detail">
                      <span className="beneficiaire-item__label">Banque:</span>
                      <span className="beneficiaire-item__value">{ben.banque}</span>
                    </div>
                    {ben.email && (
                      <div className="beneficiaire-item__detail">
                        <span className="beneficiaire-item__label">Email:</span>
                        <span className="beneficiaire-item__value">{ben.email}</span>
                      </div>
                    )}
                    {ben.telephone && (
                      <div className="beneficiaire-item__detail">
                        <span className="beneficiaire-item__label">Téléphone:</span>
                        <span className="beneficiaire-item__value">{ben.telephone}</span>
                      </div>
                    )}
                    <div className="beneficiaire-item__detail">
                      <span className="beneficiaire-item__label">Ajouté le:</span>
                      <span className="beneficiaire-item__value">
                        {new Date(ben.dateAjout).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="beneficiaire-item__actions">
                  <button className="beneficiaire-item__button" onClick={() => handleEditBeneficiaire(ben._id)}>
                    <IonIcon icon={createOutline} />
                    Modifier
                  </button>
                  <button
                    className="beneficiaire-item__button beneficiaire-item__button--danger"
                    onClick={() => handleDeleteBeneficiaire(ben._id)}
                  >
                    <IonIcon icon={personRemoveOutline} />
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default GestionBeneficiaires
