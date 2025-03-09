"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { IonIcon, IonModal, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton } from "@ionic/react"
import { closeOutline, addOutline, trashOutline, colorPaletteOutline, saveOutline } from "ionicons/icons"
import "./BudgetCategoryManager.css"

interface BudgetCategory {
  id: string
  name: string
  limit: number
  color: string
  current: number
}

interface BudgetCategoryManagerProps {
  isOpen: boolean
  onClose: () => void
  initialCategories?: BudgetCategory[]
  onSave: (categories: BudgetCategory[]) => void
}

const DEFAULT_CATEGORIES: BudgetCategory[] = [
  { id: "1", name: "Alimentation", limit: 600, color: "#47ce65", current: 450 },
  { id: "2", name: "Transport", limit: 300, color: "#ffcc00", current: 200 },
  { id: "3", name: "Loisirs", limit: 200, color: "#346fce", current: 150 },
  { id: "4", name: "Shopping", limit: 400, color: "#f472b6", current: 300 },
  { id: "5", name: "Factures", limit: 250, color: "#60a5fa", current: 180 },
]

const PRESET_COLORS = [
  "#47ce65", // Green
  "#ffcc00", // Yellow
  "#346fce", // Blue
  "#f472b6", // Pink
  "#60a5fa", // Light blue
  "#ff2b2b", // Red
  "#9333ea", // Purple
  "#f97316", // Orange
  "#14b8a6", // Teal
  "#64748b", // Slate
]

const BudgetCategoryManager: React.FC<BudgetCategoryManagerProps> = ({
  isOpen,
  onClose,
  initialCategories,
  onSave,
}) => {
  const [categories, setCategories] = useState<BudgetCategory[]>(
    initialCategories || DEFAULT_CATEGORIES
  )
    const [newCategoryName, setNewCategoryName] = useState<string>("")
  const [newCategoryLimit, setNewCategoryLimit] = useState<number>(500)
  const [newCategoryColor, setNewCategoryColor] = useState<string>(PRESET_COLORS[0])
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [editingName, setEditingName] = useState<string>("")

  const newNameInputRef = useRef<HTMLInputElement>(null)
  const editNameInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (initialCategories) {
      setCategories(initialCategories)
    }
  }, [initialCategories])
  
  
  
  

  useEffect(() => {
    if (editingCategory && editNameInputRef.current) {
      editNameInputRef.current.focus()
    }
  }, [editingCategory])

  const handleUpdateCategory = (id: string, field: keyof BudgetCategory, value: string | number) => {
    console.log(`Updating category ${id}, field ${field} to value:`, value)

    // Create a new array with the updated category
    const updatedCategories = categories.map((category) => {
      if (category.id === id) {
        return { ...category, [field]: value }
      }
      return category
    })

    // Update the state with the new array
    setCategories(updatedCategories)
  }

  const startEditing = (category: BudgetCategory) => {
    setEditingCategory(category.id)
    setEditingName(category.name)
  }

  const saveEditing = () => {
    if (editingCategory && editingName.trim()) {
      handleUpdateCategory(editingCategory, "name", editingName)
      setEditingCategory(null)
    }
  }

  const handleAddCategory = () => {
    if (newCategoryName.trim() === "") return

    console.log("Adding new category:", newCategoryName)

    const category = {
      id: Date.now().toString(),
      name: newCategoryName,
      limit: newCategoryLimit,
      color: newCategoryColor,
      current: 0, // Make sure this is always set
    }

    // Create a new array with the new category added
    const updatedCategories = [...categories, category]

    // Update the state with the new array
    setCategories(updatedCategories)

    // Reset form fields
    setNewCategoryName("")
    setNewCategoryLimit(500)
    setNewCategoryColor(PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)])
  }

  const handleDeleteCategory = (id: string) => {
    // Create a new array without the deleted category
    const updatedCategories = categories.filter((category) => category.id !== id)

    // Update the state with the new array
    setCategories(updatedCategories)
  }

  const handleSave = () => {
    onSave(categories)
    onClose()
  }

  const handleRangeChange = (id: string, value: string) => {
    const numValue = Number.parseInt(value, 10)
    console.log(`Range changed for ${id} to ${numValue}`)
    handleUpdateCategory(id, "limit", numValue)
  }

  const handleColorSelect = (id: string, color: string) => {
    console.log(`Color selected for ${id}: ${color}`)
    handleUpdateCategory(id, "color", color)
  }

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose} className="budget-modal">
      <IonHeader>
        <IonToolbar className="budget-toolbar">
          <IonTitle>Gérer les Catégories de Budget</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onClose}>
              <IonIcon icon={closeOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="budget-content">
        <div className="budget-manager-container">
          <div className="budget-categories-list">
            <h3>Catégories Actuelles</h3>
            {categories.map((category) => (
              <div key={category.id} className="budget-category-item">
                <div className="category-color-indicator" style={{ backgroundColor: category.color }}></div>
                <div className="category-details">
                  {editingCategory === category.id ? (
                    <div className="edit-name-container">
                      <input
                        ref={editNameInputRef}
                        type="text"
                        className="edit-name-input"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onBlur={saveEditing}
                        onKeyDown={(e) => e.key === "Enter" && saveEditing()}
                      />
                      <button className="save-edit-button" onClick={saveEditing}>
                        Enregistrer
                      </button>
                    </div>
                  ) : (
                    <div className="category-name" onClick={() => startEditing(category)}>
                      {category.name}
                    </div>
                  )}
                  <div className="category-limit-container">
                    <div className="limit-label">Limite: {category.limit} TND</div>
                    <div className="range-container">
                      <input
                        type="range"
                        min="100"
                        max="2000"
                        step="50"
                        value={category.limit}
                        onChange={(e) => handleRangeChange(category.id, e.target.value)}
                        className="standard-range"
                      />
                    </div>
                  </div>
                  <div className="color-selector">
                    {PRESET_COLORS.map((color) => (
                      <div
                        key={color}
                        className={`color-option ${category.color === color ? "selected" : ""}`}
                        style={{ backgroundColor: color }}
                        onClick={() => handleColorSelect(category.id, color)}
                      ></div>
                    ))}
                  </div>
                </div>
                <button
                  className="delete-button-standard"
                  onClick={() => handleDeleteCategory(category.id)}
                  type="button"
                >
                  <IonIcon icon={trashOutline} />
                </button>
              </div>
            ))}
          </div>

          <div className="add-category-section">
            <h3>Ajouter une Nouvelle Catégorie</h3>
            <div className="new-category-form">
              <div className="form-row">
                <div className="input-group">
                  <label htmlFor="new-category-name">Nom de la catégorie</label>
                  <input
                    ref={newNameInputRef}
                    id="new-category-name"
                    type="text"
                    className="standard-input"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Ex: Éducation"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="limit-container">
                  <label>Limite: {newCategoryLimit} TND</label>
                  <div className="range-container">
                    <input
                      type="range"
                      min="100"
                      max="2000"
                      step="50"
                      value={newCategoryLimit}
                      onChange={(e) => setNewCategoryLimit(Number.parseInt(e.target.value, 10))}
                      className="standard-range"
                    />
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="color-selector-container">
                  <div className="color-label">
                    <IonIcon icon={colorPaletteOutline} /> Couleur
                  </div>
                  <div className="color-options">
                    {PRESET_COLORS.map((color) => (
                      <div
                        key={color}
                        className={`color-option ${newCategoryColor === color ? "selected" : ""}`}
                        style={{ backgroundColor: color }}
                        onClick={() => setNewCategoryColor(color)}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>

              <button
                className="add-button-standard"
                onClick={handleAddCategory}
                disabled={!newCategoryName.trim()}
                type="button"
              >
                <IonIcon icon={addOutline} />
                Ajouter la Catégorie
              </button>
            </div>
          </div>

          <div className="action-buttons">
            <button className="save-button-standard" onClick={handleSave} type="button">
              <IonIcon icon={saveOutline} />
              Enregistrer les Modifications
            </button>
          </div>
        </div>
      </IonContent>
    </IonModal>
  )
}

export default BudgetCategoryManager

