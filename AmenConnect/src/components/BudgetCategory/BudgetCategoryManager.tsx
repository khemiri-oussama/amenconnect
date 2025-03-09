"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { IonIcon, IonModal, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton } from "@ionic/react";
import { closeOutline, addOutline, trashOutline, colorPaletteOutline, saveOutline } from "ionicons/icons";
import "./BudgetCategoryManager.css";
import { useAuth } from "../../AuthContext";

interface BudgetCategory {
  userId: string;
  id: string;
  name: string;
  limit: number;
  color: string;
  current: number;
  _id : string;
  __v : number;
  createdAt :Date;
  updatedAt:Date;
}

interface BudgetCategoryManagerProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  initialCategories?: BudgetCategory[];
  onSave: (categories: BudgetCategory[]) => void;
}


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
];

const BudgetCategoryManager: React.FC<BudgetCategoryManagerProps> = ({
  isOpen,
  onClose,
  userId,
  onSave,
}) => {
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [newCategoryName, setNewCategoryName] = useState<string>("");
  const [newCategoryLimit, setNewCategoryLimit] = useState<number>(500);
  const [newCategoryColor, setNewCategoryColor] = useState<string>(PRESET_COLORS[0]);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>("");

  const newNameInputRef = useRef<HTMLInputElement>(null);
  const editNameInputRef = useRef<HTMLInputElement>(null);
  const { profile } = useAuth();

  // Helper function to map fetched category to include `id`
  const mapCategory = (cat: any): BudgetCategory => ({
    ...cat,
    id: cat._id,
  });

  // Fetch categories from the API when the component mounts or when the profile changes.
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch(`/api/categories?userId=${profile?.user._id}`);
        if (!response.ok) {
          throw new Error("Error fetching categories");
        }
        const data = await response.json();
        // Map each category to have an `id` field.
        setCategories(data.map(mapCategory));
      } catch (error) {
        console.error(error);
      }
    }
    if (profile?.user._id) {
      fetchCategories();
    }
  }, [profile, userId]);

  useEffect(() => {
    if (editingCategory && editNameInputRef.current) {
      editNameInputRef.current.focus();
    }
  }, [editingCategory]);

  // Update category via API (PUT) and update local state.
  const handleUpdateCategory = async (id: string, field: keyof BudgetCategory, value: string | number) => {
    try {
      const categoryToUpdate = categories.find((cat) => cat.id === id);
      if (!categoryToUpdate) return;

      const newCategoryData = { ...categoryToUpdate, [field]: value };

      // Remove extra fields before sending.
      const { id: _ignore, _id, __v, createdAt, updatedAt, ...payload } = newCategoryData;
      if (!payload.userId && profile?.user._id) {
        payload.userId = profile.user._id;
      }

      // Optimistically update state.
      setCategories((prev) =>
        prev.map((cat) => (cat.id === id ? newCategoryData : cat))
      );

      const response = await fetch(`/api/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Update error details:", errorData);
        throw new Error("Error updating category");
      }
      const data = await response.json();
      // Map the returned category.
      const updatedCategory: BudgetCategory = { ...data, id: data._id };
      setCategories((prev) => prev.map((cat) => (cat.id === id ? updatedCategory : cat)));
    } catch (error) {
      console.error(error);
    }
  };

  const startEditing = (category: BudgetCategory) => {
    setEditingCategory(category.id);
    setEditingName(category.name);
  };

  const saveEditing = () => {
    if (editingCategory && editingName.trim()) {
      handleUpdateCategory(editingCategory, "name", editingName);
      setEditingCategory(null);
    }
  };

  // Create a new category via API (POST) and update local state.
  const handleAddCategory = async () => {
    if (newCategoryName.trim() === "") return;

    const categoryPayload = {
      userId: profile?.user._id,
      name: newCategoryName,
      limit: newCategoryLimit,
      color: newCategoryColor,
      current: 0,
    };

    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryPayload),
      });
      if (!response.ok) {
        throw new Error("Error creating category");
      }
      const newCategory = await response.json();
      // Map the new category.
      const mappedCategory: BudgetCategory = { ...newCategory, id: newCategory._id };
      setCategories([...categories, mappedCategory]);
      setNewCategoryName("");
      setNewCategoryLimit(500);
      setNewCategoryColor(PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)]);
    } catch (error) {
      console.error(error);
    }
  };

  // Delete a category via API (DELETE) and update local state.
  const handleDeleteCategory = async (id: string) => {
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Error deleting category");
      }
      setCategories(categories.filter((category) => category.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = () => {
    onSave(categories);
    onClose();
  };

  const handleRangeChange = (id: string, value: string) => {
    const numValue = Number.parseInt(value, 10);
    handleUpdateCategory(id, "limit", numValue);
  };

  const handleColorSelect = (id: string, color: string) => {
    handleUpdateCategory(id, "color", color);
  };

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
  );
};

export default BudgetCategoryManager;
