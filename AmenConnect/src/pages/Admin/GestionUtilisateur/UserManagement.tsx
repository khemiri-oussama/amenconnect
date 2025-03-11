import type React from "react";
import { useState, useEffect } from "react";
import {
  IonPage,
  IonIcon,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonSearchbar,
} from "@ionic/react";
import {
  peopleOutline,
  personAddOutline,
  keyOutline,
  createOutline,
  trashOutline,
  searchOutline,
  filterOutline,
  refreshOutline,
  eyeOutline,
  eyeOffOutline,
} from "ionicons/icons";
import axios from "axios";
import "./UserManagement.css";
import SidebarAdmin from "../../../components/SidebarAdmin";
import { useAdminAuth } from "../../../AdminAuthContext";
import AdminPageHeader from "../adminpageheader";

const UserManagement: React.FC = () => {
  const { authLoading } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<"list" | "create" | "reset">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // State for the admins list fetched from API
  const [admins, setAdmins] = useState<any[]>([]);
  const [loadingAdmins, setLoadingAdmins] = useState(true);

  // Form state for creating/editing an admin
  const [formData, setFormData] = useState({
    name: "",
    cin: "",
    email: "",
    password: "",
    role: "admin",
    department: "General",
    permissions: [] as string[],
  });
  const [showPassword, setShowPassword] = useState(false);

  // New state for password reset (forgot password)
  const [resetEmail, setResetEmail] = useState<string>("");
  const [resetErrorMessage, setResetErrorMessage] = useState<string>("");
  const [resetSuccessMessage, setResetSuccessMessage] = useState<string>("");
  const [resetIsLoading, setResetIsLoading] = useState<boolean>(false);

  // Fetch admins from API on component mount
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await fetch("/api/admin/list"); // New API endpoint
        const data = await response.json();
        setAdmins(data.admins || []);
      } catch (error) {
        console.error("Error fetching admins:", error);
      } finally {
        setLoadingAdmins(false);
      }
    };
    fetchAdmins();
  }, []);

  // Generate random password
  const generatePassword = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, password });
  };

  // Toggle password visibility
  const togglePasswordVisibility = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/admin/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Admin created successfully!");
        setActiveTab("list");
        // Optionally, refresh the admins list after adding a new admin:
        const refreshed = await fetch("/api/admin");
        const refreshedData = await refreshed.json();
        setAdmins(refreshedData.admins || []);
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("An error occurred while creating the admin.");
    }
  };

  const handleDelete = async (adminId: string) => {
    if (window.confirm("Are you sure you want to delete this admin?")) {
      try {
        const response = await fetch(`/api/admin/list/${adminId}`, {
          method: "DELETE",
          credentials: "include", // Include cookies for auth
        });
        const data = await response.json();
        if (response.ok) {
          alert("Admin deleted successfully");
          // Remove the deleted admin from your state
          setAdmins((prev) => prev.filter((admin) => admin._id !== adminId));
        } else {
          alert("Error: " + data.message);
        }
      } catch (error) {
        console.error("Error deleting admin:", error);
        alert("An error occurred while deleting the admin.");
      }
    }
  };

  const handleCinChange = (e: CustomEvent) => {
    const value = e.detail.value || "";
    const numbersOnly = value.replace(/\D/g, "");
    setFormData({ ...formData, cin: numbersOnly });
  };

  const handleCinKeyDown = (e: React.KeyboardEvent) => {
    if (
      e.key === "Backspace" ||
      e.key === "Delete" ||
      e.key === "Tab" ||
      e.key === "Escape" ||
      e.key === "Enter" ||
      (e.ctrlKey && (e.key === "a" || e.key === "c" || e.key === "v" || e.key === "x")) ||
      e.key === "Home" ||
      e.key === "End" ||
      e.key === "ArrowLeft" ||
      e.key === "ArrowRight" ||
      /^[0-9]$/.test(e.key)
    ) {
      if (/^[0-9]$/.test(e.key) && formData.cin.length >= 8) {
        e.preventDefault();
      } else {
        return;
      }
    } else {
      e.preventDefault();
    }
  };

  // Function to validate email using a simple regex
  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  // Handler for password reset based on email
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetErrorMessage("");
    setResetSuccessMessage("");
    setResetIsLoading(true);

    if (!resetEmail.trim() || !validateEmail(resetEmail)) {
      setResetErrorMessage("Veuillez saisir une adresse email valide.");
      setResetIsLoading(false);
      return;
    }

    try {
      const response = await axios.post("/api/password/forgot-password", { email: resetEmail });
      setResetSuccessMessage(
        response.data.message ||
          "Un e-mail de réinitialisation a été envoyé à cette adresse."
      );
    } catch (error: any) {
      setResetErrorMessage(
        error.response?.data?.message || "Erreur inattendue lors de la réinitialisation."
      );
    } finally {
      setResetIsLoading(false);
    }
  };

  if (authLoading) {
    return <div className="admin-loading">Loading...</div>;
  }

  // Apply filters on the fetched admins list
  const filteredAdmins = admins.filter((admin) => {
    const matchesSearch =
      searchQuery === "" ||
      admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || admin.role.toLowerCase() === roleFilter.toLowerCase();
    const matchesStatus =
      statusFilter === "all" ||
      (admin.status && admin.status.toLowerCase() === statusFilter.toLowerCase());
    return matchesSearch && matchesRole && matchesStatus;
  });

  const renderUserList = () => (
    <div className="admin-user-list">
      <div className="admin-filters">
        <div className="admin-search-container">
          <IonIcon icon={searchOutline} className="admin-search-icon" />
          <IonSearchbar
            className="admin-searchbar"
            placeholder="Rechercher un utilisateur"
            value={searchQuery}
            onIonChange={(e) => setSearchQuery(e.detail.value || "")}
          ></IonSearchbar>
        </div>

        <div className="admin-filter-chips">
          <div className="admin-filter-chip">
            <div className="admin-filter-label">
              <IonIcon icon={filterOutline} />
              <span>Rôle:</span>
            </div>
            <IonSelect
              interface="popover"
              className="admin-select-filter"
              value={roleFilter}
              onIonChange={(e) => setRoleFilter(e.detail.value)}
            >
              <IonSelectOption value="all">Tous</IonSelectOption>
              <IonSelectOption value="client">Client</IonSelectOption>
              <IonSelectOption value="employé">Employé</IonSelectOption>
              <IonSelectOption value="admin">Admin</IonSelectOption>
            </IonSelect>
          </div>

          <div className="admin-filter-chip">
            <div className="admin-filter-label">
              <IonIcon icon={filterOutline} />
              <span>Statut:</span>
            </div>
            <IonSelect
              interface="popover"
              className="admin-select-filter"
              value={statusFilter}
              onIonChange={(e) => setStatusFilter(e.detail.value)}
            >
              <IonSelectOption value="all">Tous</IonSelectOption>
              <IonSelectOption value="actif">Actif</IonSelectOption>
              <IonSelectOption value="inactif">Inactif</IonSelectOption>
            </IonSelect>
          </div>
        </div>
      </div>

      {loadingAdmins ? (
        <div className="admin-loading">Chargement des admins...</div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdmins.length > 0 ? (
                filteredAdmins.map((admin) => (
                  <tr key={admin._id}>
                    <td>{admin.name}</td>
                    <td>{admin.email}</td>
                    <td>
                      <span className={`admin-role-badge ${admin.role.toLowerCase()}`}>{admin.role}</span>
                    </td>
                    <td>
                      <span className={`admin-status-badge ${admin.status?.toLowerCase() || "actif"}`}>
                        {admin.status || "Actif"}
                      </span>
                    </td>
                    <td>
                      <div className="admin-action-buttons">
                        <button
                          className="admin-icon-button edit"
                          onClick={() => setActiveTab("create")}
                          title="Modifier"
                        >
                          <IonIcon icon={createOutline} />
                        </button>
                        <button
                          className="admin-icon-button delete"
                          title="Supprimer"
                          onClick={() => handleDelete(admin._id)}
                        >
                          <IonIcon icon={trashOutline} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="admin-no-results">
                    Aucun administrateur trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderUserForm = () => (
    <div className="admin-form-container">
      <form className="admin-user-form" onSubmit={handleSubmit}>
        {/* ... your existing form fields remain unchanged ... */}
        <div className="admin-form-group">
          <label className="admin-form-label">Nom</label>
          <div className="admin-input-wrapper">
            <IonInput
              type="text"
              required
              className="admin-input"
              placeholder="Nom complet"
              value={formData.name}
              onIonChange={(e) =>
                setFormData({ ...formData, name: e.detail.value || "" })
              }
            ></IonInput>
          </div>
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">CIN</label>
          <div className="admin-input-wrapper">
            <IonInput
              type="tel"
              required
              className="admin-input"
              placeholder="12345678"
              maxlength={8}
              value={formData.cin}
              onIonChange={handleCinChange}
              onKeyDown={handleCinKeyDown}
              pattern="[0-9]*"
              inputmode="numeric"
            ></IonInput>
            <small className="admin-input-hint">
              Le CIN doit contenir exactement 8 chiffres
            </small>
          </div>
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">Email</label>
          <div className="admin-input-wrapper">
            <IonInput
              type="email"
              required
              className="admin-input"
              placeholder="admin@example.com"
              value={formData.email}
              onIonChange={(e) =>
                setFormData({ ...formData, email: e.detail.value || "" })
              }
            ></IonInput>
          </div>
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">Mot de passe</label>
          <div className="admin-input-wrapper password-input-wrapper">
            <IonInput
              type={showPassword ? "text" : "password"}
              required
              className="admin-input password-input"
              readonly
              value={formData.password}
            ></IonInput>
            <div className="password-actions">
              <button
                type="button"
                className="password-action-button generate"
                onClick={generatePassword}
                title="Générer un mot de passe"
              >
                <IonIcon icon={refreshOutline} />
              </button>
              <button
                type="button"
                className="password-action-button toggle"
                onClick={togglePasswordVisibility}
                title={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                <IonIcon icon={showPassword ? eyeOffOutline : eyeOutline} />
              </button>
            </div>
          </div>
          <small className="admin-input-hint">
            Cliquez sur l'icône pour générer un mot de passe aléatoire
          </small>
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">Rôle</label>
          <div className="admin-select-wrapper">
            <IonSelect
              interface="popover"
              className="admin-select"
              value={formData.role}
              onIonChange={(e) =>
                setFormData({ ...formData, role: e.detail.value })
              }
            >
              <IonSelectOption value="admin">Admin</IonSelectOption>
              <IonSelectOption value="superadmin">Super Admin</IonSelectOption>
              <IonSelectOption value="manager">Manager</IonSelectOption>
            </IonSelect>
          </div>
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">Département</label>
          <div className="admin-input-wrapper">
            <IonInput
              type="text"
              className="admin-input"
              placeholder="General"
              value={formData.department}
              onIonChange={(e) =>
                setFormData({ ...formData, department: e.detail.value || "General" })
              }
            ></IonInput>
          </div>
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">Permissions</label>
          <div className="admin-permissions-container">
            <div className="admin-permission-checkbox">
              <input
                type="checkbox"
                id="perm-users"
                checked={formData.permissions.includes("users")}
                onChange={(e) => {
                  const newPermissions = e.target.checked
                    ? [...formData.permissions, "users"]
                    : formData.permissions.filter((p) => p !== "users");
                  setFormData({ ...formData, permissions: newPermissions });
                }}
              />
              <label htmlFor="perm-users">Gestion des utilisateurs</label>
            </div>
            <div className="admin-permission-checkbox">
              <input
                type="checkbox"
                id="perm-content"
                checked={formData.permissions.includes("content")}
                onChange={(e) => {
                  const newPermissions = e.target.checked
                    ? [...formData.permissions, "content"]
                    : formData.permissions.filter((p) => p !== "content");
                  setFormData({ ...formData, permissions: newPermissions });
                }}
              />
              <label htmlFor="perm-content">Gestion du contenu</label>
            </div>
            <div className="admin-permission-checkbox">
              <input
                type="checkbox"
                id="perm-settings"
                checked={formData.permissions.includes("settings")}
                onChange={(e) => {
                  const newPermissions = e.target.checked
                    ? [...formData.permissions, "settings"]
                    : formData.permissions.filter((p) => p !== "settings");
                  setFormData({ ...formData, permissions: newPermissions });
                }}
              />
              <label htmlFor="perm-settings">Paramètres système</label>
            </div>
            <div className="admin-permission-checkbox">
              <input
                type="checkbox"
                id="perm-reports"
                checked={formData.permissions.includes("reports")}
                onChange={(e) => {
                  const newPermissions = e.target.checked
                    ? [...formData.permissions, "reports"]
                    : formData.permissions.filter((p) => p !== "reports");
                  setFormData({ ...formData, permissions: newPermissions });
                }}
              />
              <label htmlFor="perm-reports">Rapports et statistiques</label>
            </div>
          </div>
        </div>
        <div className="admin-form-actions">
          <button
            type="button"
            className="admin-button secondary"
            onClick={() => setActiveTab("list")}
          >
            Annuler
          </button>
          <button type="submit" className="admin-button primary">
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  );

  const renderPasswordReset = () => (
    <div className="admin-form-container">
      <form className="admin-reset-form" onSubmit={handleResetPassword}>
        <div className="admin-form-group">
          <label className="admin-form-label">Email de l'utilisateur</label>
          <div className="admin-input-wrapper">
            <IonInput
              type="email"
              required
              className="admin-input"
              placeholder="user@example.com"
              value={resetEmail}
              onIonChange={(e) => setResetEmail(e.detail.value!)}
            ></IonInput>
          </div>
        </div>

        {resetErrorMessage && (
          <div className="admin-error-message">{resetErrorMessage}</div>
        )}

        {resetSuccessMessage && (
          <div className="admin-success-message">{resetSuccessMessage}</div>
        )}

        <div className="admin-form-actions">
          <button
            type="button"
            className="admin-button secondary"
            onClick={() => setActiveTab("list")}
          >
            Annuler
          </button>
          <button type="submit" className="admin-button primary" disabled={resetIsLoading}>
            {resetIsLoading ? "Envoi en cours..." : "Envoyer le lien de réinitialisation"}
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <IonPage>
      <div className="admin-dashboard-layout">
        <SidebarAdmin currentPage="Utilisateurs" />
        <div className="admin-dashboard-content">
          <AdminPageHeader
            title="Gestion des Utilisateurs"
            subtitle="Gérez les comptes utilisateurs et leurs permissions"
          />
          <div className="admin-content-card">
            <div className="admin-tabs">
              <button
                className={`admin-tab ${activeTab === "list" ? "active" : ""}`}
                onClick={() => setActiveTab("list")}
              >
                <IonIcon icon={peopleOutline} />
                <span>Liste des utilisateurs</span>
              </button>
              <button
                className={`admin-tab ${activeTab === "create" ? "active" : ""}`}
                onClick={() => setActiveTab("create")}
              >
                <IonIcon icon={personAddOutline} />
                <span>Créer/Éditer un utilisateur</span>
              </button>
              <button
                className={`admin-tab ${activeTab === "reset" ? "active" : ""}`}
                onClick={() => setActiveTab("reset")}
              >
                <IonIcon icon={keyOutline} />
                <span>Réinitialiser le mot de passe</span>
              </button>
            </div>
            <div className="admin-tab-content">
              {activeTab === "list" && renderUserList()}
              {activeTab === "create" && renderUserForm()}
              {activeTab === "reset" && renderPasswordReset()}
            </div>
          </div>
        </div>
      </div>
    </IonPage>
  );
};

export default UserManagement;
