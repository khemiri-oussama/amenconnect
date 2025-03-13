import React, { useState } from "react";
import { IonIcon } from "@ionic/react";
import { documentOutline } from "ionicons/icons";
import ImageViewer from "./image-viewer";
import "./image-viewer.css";

interface DocumentPreviewProps {
  documents: {
    label: string;
    data: string | null;
  }[];
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({ documents }) => {
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  const validDocuments = documents.filter(doc => doc.data && doc.data.startsWith('data:'));
  
  const handleOpenViewer = (index: number) => {
    setSelectedImageIndex(index);
    setIsViewerOpen(true);
  };
  
  return (
    <>
      <div className="document-preview-container">
        {documents.map((doc, index) => (
          <div 
            key={index} 
            className="document-preview-item"
            onClick={() => doc.data && doc.data.startsWith('data:') ? handleOpenViewer(
              validDocuments.findIndex(d => d.label === doc.label)
            ) : undefined}
          >
            {doc.data && doc.data.startsWith('data:') ? (
              <>
                <img 
                  src={doc.data || "/placeholder.svg"} 
                  alt={doc.label} 
                  className="document-preview-image" 
                />
                <div className="document-preview-label">{doc.label}</div>
              </>
            ) : (
              <>
                <div className="document-preview-placeholder">
                  <IonIcon icon={documentOutline} size="large" />
                </div>
                <div className="document-preview-label">{doc.label} (Non disponible)</div>
              </>
            )}
          </div>
        ))}
      </div>
      
      <ImageViewer 
        images={validDocuments}
        initialIndex={selectedImageIndex}
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
      />
    </>
  );
};

export default DocumentPreview;
