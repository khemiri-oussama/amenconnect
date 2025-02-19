import { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { useAuth, User } from "../AuthContext";

export function useLogin() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const history = useHistory();
  const { setPendingUser } = useAuth();

  const login = async (email: string, password: string) => {
    setErrorMessage("");
    setIsLoading(true);

    // Basic validation
    if (!email.trim() || !password.trim()) {
      setErrorMessage("Veuillez remplir tous les champs.");
      setIsLoading(false);
      return;
    }

    try {
      // Send credentials to your backend (include credentials if needed)
      const response = await axios.post(
        "/api/auth/login",
        { email, password },
        { withCredentials: true }
      );

      // Since the login endpoint only sends a success message,
      // check the message and set a temporary pending user before redirecting.
      if (response.data.message) {
        // Set a minimal pending user (you can include additional data if needed)
        setPendingUser({ id: "", email });
        history.replace("/otp");
      } else {
        throw new Error("Réponse inattendue.");
      }
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message || "Erreur inattendue."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, errorMessage, login };
}
