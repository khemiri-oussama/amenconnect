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

interface Beneficiaire {
  _id: string
  nom: string
  prenom: string
  numeroCompte: string
  banque: string
  email?: string
  telephone?: string
  dateAjout: string
}

const GestionBeneficiaires: React.FC = () => {
  const [beneficiaires, setBeneficiaires] = useState<Beneficiaire[]>([])
  const [filteredBeneficiaires, setFilteredBeneficiaires] = useState<Beneficiaire[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
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

  useEffect(() => {
    // Fetch beneficiaries
    const fetchBeneficiaires = async () => {
      try {
        // This would be replaced with an actual API call
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const mockBeneficiaires = [
          {
            _id: "b1",
            nom: "Dupont",
            prenom: "Jean",
            numeroCompte: "TN5910000123456789",
            banque: "Banque Nationale",
            email: "jean.dupont@email.com",
            telephone: "+216 71 123 456",
            dateAjout: "2023-01-15",
          },
          {
            _id: "b2",
            nom: "Martin",
            prenom: "Sophie",
            numeroCompte: "TN5910000987654321",
            banque: "Banque Centrale",
            email: "sophie.martin@email.com",
            telephone: "+216 71 234 567",
            dateAjout: "2023-03-22",
          },
          {
            _id: "b3",
            nom: "Trabelsi",
            prenom: "Ahmed",
            numeroCompte: "TN5910000567891234",
            banque: "Banque du Sud",
            email: "ahmed.trabelsi@email.com",
            telephone: "+216 71 345 678",
            dateAjout: "2023-05-10",
          },
        ]

        setBeneficiaires(mockBeneficiaires)
        setFilteredBeneficiaires(mockBeneficiaires)
      } catch (error: any) {
        console.error("Error fetching beneficiaries:", error)
        setError(error.message || "Une erreur est survenue lors de la récupération des bénéficiaires")
      } finally {
        setLoading(false)
      }
    }

    fetchBeneficiaires()
  }, [])

  useEffect(() => {
    // Apply search filter
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
        // This would be replaced with an actual API call
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500))

        setBeneficiaires((prev) => prev.filter((ben) => ben._id !== id))
        setFormSuccess("Bénéficiaire supprimé avec succès")

        // Hide success message after 3 seconds
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

      // This would be replaced with an actual API call
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (editingId) {
        // Update existing beneficiary
        setBeneficiaires((prev) =>
          prev.map((ben) =>
            ben._id === editingId
              ? {
                  ...ben,
                  prenom: formData.prenom,
                  nom: formData.nom,
                  numeroCompte: formData.numeroCompte,
                  banque: formData.banque,
                  email: formData.email,
                  telephone: formData.telephone,
                }
              : ben,
          ),
        )
        setFormSuccess("Bénéficiaire modifié avec succès")
      } else {
        // Add new beneficiary
        const newBeneficiaire: Beneficiaire = {
          _id: `b${Date.now()}`,
          prenom: formData.prenom,
          nom: formData.nom,
          numeroCompte: formData.numeroCompte,
          banque: formData.banque,
          email: formData.email,
          telephone: formData.telephone,
          dateAjout: new Date().toISOString().split("T")[0],
        }

        setBeneficiaires((prev) => [...prev, newBeneficiaire])
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
                      <span className="beneficiaire-item__value">{new Date(ben.dateAjout).toLocaleDateString()}</span>
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

