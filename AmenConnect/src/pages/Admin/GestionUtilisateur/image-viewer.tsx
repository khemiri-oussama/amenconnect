import React, { useState } from "react";
import { IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, IonIcon } from "@ionic/react";
import { closeOutline, downloadOutline, arrowBackOutline, arrowForwardOutline } from "ionicons/icons";

interface ImageViewerProps {
  images: { label: string; data: string }[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ images, initialIndex = 0, isOpen, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };
  
  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };
  
  const handleDownload = () => {
    if (!images[currentIndex]) return;
    
    const link = document.createElement("a");
    link.href = images[currentIndex].data;
    link.download = `${images[currentIndex].label.replace(/\s+/g, "-").toLowerCase()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  if (!images.length) return null;
  
  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose} className="image-viewer-modal">
      <IonHeader>
        <IonToolbar>
          <IonTitle>{images[currentIndex]?.label || "Image"}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleDownload}>
              <IonIcon icon={downloadOutline} />
            </IonButton>
            <IonButton onClick={onClose}>
              <IonIcon icon={closeOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="image-viewer-container">
          {images.length > 1 && (
            <button className="image-nav-button prev" onClick={handlePrevious}>
              <IonIcon icon={arrowBackOutline} />
            </button>
          )}
          
          <div className="image-display">
            <img 
              src={images[currentIndex]?.data || "/placeholder.svg"} 
              alt={images[currentIndex]?.label} 
              className="fullscreen-image"
            />
          </div>
          
          {images.length > 1 && (
            <button className="image-nav-button next" onClick={handleNext}>
              <IonIcon icon={arrowForwardOutline} />
            </button>
          )}
        </div>
        
        {images.length > 1 && (
          <div className="image-thumbnails">
            {images.map((image, index) => (
              <div 
                key={index} 
                className={`image-thumbnail ${index === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(index)}
              >
                <img src={image.data || "/placeholder.svg"} alt={image.label} />
              </div>
            ))}
          </div>
        )}
      </IonContent>
    </IonModal>
  );
};

export default ImageViewer;
