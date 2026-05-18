import { Download } from 'lucide-react';

export default function ExportButton() {
  return (
    <button type="button" className="primary-button" onClick={() => window.print()}>
      Télécharger le rapport
      <Download size={16} />
    </button>
  );
}
