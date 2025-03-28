"use client"

import React, { useState, useRef } from "react"
import Keyboard from "react-simple-keyboard"
import "react-simple-keyboard/build/css/index.css"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import type { FormData } from "./types"
import tunisiaLocations from "./tunisiaLocations.json" // adjust the path as needed

interface Page1Props {
  formData: FormData
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
  handleRadioChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  formErrors: string[]
}

const Page1Component: React.FC<Page1Props> = ({ formData, handleInputChange, handleRadioChange, formErrors }) => {
  // Local state for state/city dropdowns
  const [selectedState, setSelectedState] = useState<string>("")

  // State for react-simple-keyboard and its position
  const [showKeyboard, setShowKeyboard] = useState(false)
  const [activeInput, setActiveInput] = useState<string | null>(null)
  const [keyboardInput, setKeyboardInput] = useState("")
  const [keyboardPosition, setKeyboardPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 })

  // Ref for the keyboard container
  const keyboardRef = useRef<HTMLDivElement>(null)

  // Local state for date pickers (converting string to Date)
  const [selectedBirthDate, setSelectedBirthDate] = useState<Date | null>(
    formData.dateNaissance ? new Date(formData.dateNaissance) : null,
  )
  const [selectedCINDate, setSelectedCINDate] = useState<Date | null>(
    formData.dateDelivranceCIN ? new Date(formData.dateDelivranceCIN) : null,
  )

  // Function to show keyboard when an input is focused.
  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>, name: string, currentValue: string) => {
    const rect = e.target.getBoundingClientRect()
    // Position the keyboard 10px below the input.
    setKeyboardPosition({ top: rect.bottom + window.scrollY + 10, left: rect.left + window.scrollX })
    setActiveInput(name)
    setKeyboardInput(currentValue)
    setShowKeyboard(true)
  }

  // Handle clicks outside the keyboard to close it
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        keyboardRef.current &&
        !keyboardRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).matches("input")
      ) {
        setShowKeyboard(false)
        setActiveInput(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Update keyboard input and trigger the parent onChange handler.
  // The onChange from react-simple-keyboard returns the entire string.
  const onKeyboardChange = (input: string) => {
    setKeyboardInput(input)
    if (activeInput) {
      const syntheticEvent = {
        target: { name: activeInput, value: input },
      } as React.ChangeEvent<HTMLInputElement>
      handleInputChange(syntheticEvent)
    }
  }

  // Optionally handle key presses (e.g. hide on Enter)
  const onKeyboardKeyPress = (button: string) => {
    if (button === "{enter}") {
      setShowKeyboard(false)
      setActiveInput(null)
    }
  }

  // Local handlers for state and city dropdowns remain the same
  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const stateName = e.target.value
    setSelectedState(stateName)
    // Clear previously selected city by setting ville and codePostal to empty.
    handleInputChange({
      ...e,
      target: { ...e.target, name: "ville", value: "" },
    })
    handleInputChange({
      ...e,
      target: { ...e.target, name: "codePostal", value: "" },
    })
  }

  const selectedStateObj = tunisiaLocations.states.find((state) => state.name === selectedState)
  const cities = selectedStateObj ? selectedStateObj.cities : []

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value
    if (selected === "") {
      handleInputChange({
        ...e,
        target: { ...e.target, name: "ville", value: "" },
      })
      handleInputChange({
        ...e,
        target: { ...e.target, name: "codePostal", value: "" },
      })
      return
    }
    const [city, postalCode] = selected.split(" - ")
    handleInputChange({
      ...e,
      target: { ...e.target, name: "ville", value: city },
    })
    handleInputChange({
      ...e,
      target: { ...e.target, name: "codePostal", value: postalCode },
    })
  }

  const selectedLocation = formData.ville && formData.codePostal ? `${formData.ville} - ${formData.codePostal}` : ""

  // Handlers for date pickers
  const handleBirthDateChange = (date: Date | null) => {
    setSelectedBirthDate(date)
    const syntheticEvent = {
      target: { name: "dateNaissance", value: date ? date.toISOString().split("T")[0] : "" },
    } as React.ChangeEvent<HTMLInputElement>
    handleInputChange(syntheticEvent)
  }

  const handleCINDateChange = (date: Date | null) => {
    setSelectedCINDate(date)
    const syntheticEvent = {
      target: { name: "dateDelivranceCIN", value: date ? date.toISOString().split("T")[0] : "" },
    } as React.ChangeEvent<HTMLInputElement>
    handleInputChange(syntheticEvent)
  }

  return (
    <section className="acf-form-section">
      <h3 className="acf-section-title">Informations Personnelles</h3>

      {/* Personal Information */}
      <div className="acf-form-row">
        <div className="acf-form-field">
          <label htmlFor="nom">
            Nom<span className="required">**</span>
          </label>
          <input
            type="text"
            id="nom"
            name="nom"
            value={formData.nom}
            onFocus={(e) => handleInputFocus(e, "nom", formData.nom)}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="acf-form-field">
          <label htmlFor="prenom">
            Prénom<span className="required">**</span>
          </label>
          <input
            type="text"
            id="prenom"
            name="prenom"
            value={formData.prenom}
            onFocus={(e) => handleInputFocus(e, "prenom", formData.prenom)}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      <div className="acf-form-row">
        <div className="acf-form-field">
          <label htmlFor="dateNaissance">
            Date de naissance<span className="required">**</span>
          </label>
          <DatePicker
            id="dateNaissance"
            selected={selectedBirthDate}
            onChange={handleBirthDateChange}
            dateFormat="yyyy-MM-dd"
            placeholderText="Sélectionner une date"
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
            onFocus={(e) => handleInputFocus(e, "lieuNaissance", formData.lieuNaissance)}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      {/* CIN Information */}
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
            onFocus={(e) => handleInputFocus(e, "numeroCIN", formData.numeroCIN)}
            onChange={handleInputChange}
            maxLength={8}
            pattern="\d{8}"
            required
          />
        </div>
        <div className="acf-form-field">
          <label htmlFor="dateDelivranceCIN">
            Date de délivrance CIN<span className="required">**</span>
          </label>
          <DatePicker
            id="dateDelivranceCIN"
            selected={selectedCINDate}
            onChange={handleCINDateChange}
            dateFormat="yyyy-MM-dd"
            placeholderText="Sélectionner une date"
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
            onFocus={(e) => handleInputFocus(e, "lieuDelivranceCIN", formData.lieuDelivranceCIN)}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      {/* Other Personal Details */}
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
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onFocus={(e) => handleInputFocus(e, "email", formData.email)}
            onChange={handleInputChange}
            required
          />
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
            onFocus={(e) => handleInputFocus(e, "numeroGSM", formData.numeroGSM)}
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
            onFocus={(e) => handleInputFocus(e, "adresseDomicile", formData.adresseDomicile)}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      {/* State Dropdown */}
      <div className="acf-form-row">
        <div className="acf-form-field">
          <label htmlFor="state">État / Région</label>
          <select id="state" name="state" value={selectedState} onChange={handleStateChange}>
            <option value="">Sélectionner un état</option>
            {tunisiaLocations.states.map((state, index) => (
              <option key={index} value={state.name}>
                {state.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* City Dropdown (dependent on selected state) */}
      <div className="acf-form-row">
        <div className="acf-form-field">
          <label htmlFor="city">Ville et Code postal</label>
          <select id="city" name="city" value={selectedLocation} onChange={handleCityChange} disabled={!selectedState}>
            <option value="">{selectedState ? "Sélectionner une ville" : "Sélectionnez d'abord un état"}</option>
            {cities.map((city: any, index: number) => (
              <option key={index} value={`${city.name} - ${city.postalCode || "N/A"}`}>
                {city.name} - {city.postalCode || "N/A"}
              </option>
            ))}
          </select>
          {selectedState && cities.length === 0 && (
            <p style={{ color: "red", fontSize: "0.9em" }}>Aucune ville trouvée pour cet état.</p>
          )}
        </div>
      </div>

      {/* Activity Section */}
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
          <input
            type="text"
            id="fonction"
            name="fonction"
            value={formData.fonction}
            onFocus={(e) => handleInputFocus(e, "fonction", formData.fonction)}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* FATCA Section */}
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
              <input
                type="text"
                id="pays"
                name="pays"
                value={formData.pays}
                onFocus={(e) => handleInputFocus(e, "pays", formData.pays)}
                onChange={handleInputChange}
              />
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
                <input
                  type="text"
                  id="codeTIN"
                  name="codeTIN"
                  value={formData.codeTIN}
                  onFocus={(e) => handleInputFocus(e, "codeTIN", formData.codeTIN)}
                  onChange={handleInputChange}
                />
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

      {/* Render react-simple-keyboard when needed */}
      {showKeyboard && (
        <div
          ref={keyboardRef}
          className="simple-keyboard-container"
          style={{
            position: "absolute",
            top: keyboardPosition.top,
            left: keyboardPosition.left,
            zIndex: 1000,
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            backgroundColor: "#fff",
          }}
        >
          <Keyboard
            onChange={onKeyboardChange}
            onKeyPress={onKeyboardKeyPress}
            layoutName="default"
            value={keyboardInput}
          />
        </div>
      )}
    </section>
  )
}

export default Page1Component

