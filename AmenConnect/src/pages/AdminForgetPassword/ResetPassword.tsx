import { IonButton, IonContent, IonInput, IonPage, IonText, IonToast } from '@ionic/react';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './ResetPassword.css';

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenParam = params.get('token');
    const emailParam = params.get('email');

    if (tokenParam && emailParam) {
      setToken(tokenParam);
      setEmail(emailParam);
    } else {
      setError('Invalid or missing reset token.');
      setShowToast(true);
    }
  }, [location]);

  const handleSubmit = async () => {
    if (!password || !confirmPassword) {
      setError('Please enter all fields.');
      setShowToast(true);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setShowToast(true);
      return;
    }

    try {
      const response = await fetch('https://localhost:8200/admin/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, token, newPassword: password }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess('Password reset successfully. You can now log in.');
      } else {
        setError(data.message || 'Password reset failed.');
      }
      setShowToast(true);
    } catch (err) {
      setError('Something went wrong.');
      setShowToast(true);
    }
  };

  return (
    <IonPage>
      <IonContent className="reset-password-container">
        <div className="reset-password-card">
          <h2>Reset Password</h2>
          {error && <IonText color="danger">{error}</IonText>}
          {success && <IonText color="success">{success}</IonText>}

          <IonInput
            type="password"
            placeholder="New Password"
            value={password}
            onIonInput={(e: any) => setPassword(e.target.value)}
          />
          <IonInput
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onIonInput={(e: any) => setConfirmPassword(e.target.value)}
          />

          <IonButton expand="full" onClick={handleSubmit}>Reset Password</IonButton>
        </div>

        <IonToast isOpen={showToast} message={error || success} duration={3000} onDidDismiss={() => setShowToast(false)} />
      </IonContent>
    </IonPage>
  );
};

export default ResetPassword;
