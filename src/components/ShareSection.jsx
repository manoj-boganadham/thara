import { useState } from 'react';

function ShareSection({ shareText, coupleNames }) {
  const [copyMessage, setCopyMessage] = useState('');
  const pageUrl = typeof window === 'undefined' ? '' : window.location.href;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${pageUrl}`.trim())}`;
  const calendarUrl =
    'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Wedding%20Celebration';

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopyMessage('Invitation link copied to clipboard.');
    } catch {
      setCopyMessage('Unable to copy automatically. Please copy from address bar.');
    }
  };

  return (
    <section className="invite-section fade-in" id="share">
      <h2 className="section-heading">Share This Invitation</h2>
      <div className="section-divider" />
      <div className="share-actions">
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="location-btn">
          WhatsApp
        </a>
        <a href={calendarUrl} target="_blank" rel="noopener noreferrer" className="location-btn">
          Add to Calendar
        </a>
        <button type="button" className="location-btn" onClick={copyLink}>
          Copy Link
        </button>
      </div>
      {copyMessage ? <p className="form-success">{copyMessage}</p> : null}
      <p className="share-footnote">The Wedding of {coupleNames}</p>
    </section>
  );
}

export default ShareSection;
