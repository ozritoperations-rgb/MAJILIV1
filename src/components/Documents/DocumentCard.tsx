import type { Document } from '../../types/database';

interface DocumentCardProps {
  document: Document;
  onClick?: () => void;
}

export default function DocumentCard({ document, onClick }: DocumentCardProps) {
  const getStatusBadge = () => {
    if (document.status === 'processed') {
      return (
        <span className="status-badge ai-reviewed">
          AI REVIEWED
        </span>
      );
    } else if (document.status === 'processing') {
      return (
        <span className="status-badge pending-review">
          PENDING REVIEW
        </span>
      );
    }
    return null;
  };

  const getCategoryDisplay = () => {
    const categoryMap: Record<string, string> = {
      law_proposal: 'Legal',
      report: 'Finance',
      memo: 'Governance',
      other: 'Other'
    };
    return categoryMap[document.category] || 'Other';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <div className="document-card" onClick={onClick}>
      <div className="document-card-header">
        <div className="document-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 2v6h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        {getStatusBadge()}
      </div>

      <h3 className="document-title">{document.title}</h3>

      <div className="document-meta">
        <span>{getCategoryDisplay()}</span>
        <span>•</span>
        <span>{formatFileSize(document.file_size)}</span>
        <span>•</span>
        <span>{formatDate(document.created_at)}</span>
      </div>

      {document.confidence_score && (
        <div className="confidence-score">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                  fill="currentColor"/>
          </svg>
          <span>{document.confidence_score}% confidence</span>
        </div>
      )}

      {document.ai_summary && (
        <p className="document-summary">{document.ai_summary.slice(0, 150)}...</p>
      )}

      {document.tags && document.tags.length > 0 && (
        <div className="document-tags">
          {document.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="tag">{tag}</span>
          ))}
        </div>
      )}
    </div>
  );
}
