export default function WaterFillLoader() {
  return (
    <div className="water-loader" role="status" aria-label="Calcul en cours">
      <div className="water-loader-fill">
        <div className="water-loader-wave" />
      </div>
      <span>Analyse hydraulique en cours</span>
    </div>
  );
}
