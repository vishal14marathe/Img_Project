import { useMemo, useState } from 'react';

const EIFFEL_HEIGHT_CM = 32400;
const CM_PER_INCH = 2.54;

function cmToImperial(cm) {
  const totalInches = cm / CM_PER_INCH;
  const feet = Math.floor(totalInches / 12);
  const inches = totalInches - feet * 12;
  return { feet, inches };
}

function formatImperial(cm) {
  const { feet, inches } = cmToImperial(cm);
  return `${feet} ft ${inches.toFixed(1)} in`;
}

function App() {
  const [unit, setUnit] = useState('metric');
  const [heightCm, setHeightCm] = useState(180);

  const imperial = useMemo(() => cmToImperial(heightCm), [heightCm]);

  const scaleToFitTower = 420 / EIFFEL_HEIGHT_CM;
  const minPersonHeightPx = 18;
  const readableScale = heightCm > 0 ? minPersonHeightPx / heightCm : scaleToFitTower;
  const pxPerCm = Math.max(scaleToFitTower, readableScale);

  const personBarPx = Math.max(0, heightCm * pxPerCm);
  const towerBarPx = EIFFEL_HEIGHT_CM * pxPerCm;

  const sceneHeight = Math.max(460, towerBarPx + 36);

  const personLabel = unit === 'metric' ? `${heightCm.toFixed(1)} cm` : formatImperial(heightCm);
  const towerLabel = unit === 'metric' ? `${EIFFEL_HEIGHT_CM.toFixed(0)} cm` : formatImperial(EIFFEL_HEIGHT_CM);

  const updateMetricHeight = (value) => {
    const parsed = Number.parseFloat(value);
    if (!Number.isFinite(parsed) || parsed < 0) {
      setHeightCm(0);
      return;
    }
    setHeightCm(parsed);
  };

  const updateImperial = ({ feet, inches }) => {
    const safeFeet = Number.isFinite(feet) && feet > 0 ? feet : 0;
    const safeInches = Number.isFinite(inches) && inches > 0 ? inches : 0;
    const totalInches = safeFeet * 12 + safeInches;
    setHeightCm(totalInches * CM_PER_INCH);
  };

  return (
    <main className="app-shell">
      <section className="card">
        <h1>You vs Eiffel Tower</h1>
        <p className="subtitle">
          Compare any human height with the Eiffel Tower (324 m) in real-time.
        </p>

        <div className="controls">
          {unit === 'metric' ? (
            <label>
              Height (cm)
              <input
                type="number"
                min="0"
                step="0.1"
                value={heightCm.toFixed(1)}
                onChange={(e) => updateMetricHeight(e.target.value)}
              />
            </label>
          ) : (
            <div className="imperial-group">
              <label>
                Feet
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={imperial.feet}
                  onChange={(e) =>
                    updateImperial({
                      feet: Number.parseInt(e.target.value || '0', 10),
                      inches: imperial.inches,
                    })
                  }
                />
              </label>

              <label>
                Inches
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={imperial.inches.toFixed(1)}
                  onChange={(e) =>
                    updateImperial({
                      feet: imperial.feet,
                      inches: Number.parseFloat(e.target.value || '0'),
                    })
                  }
                />
              </label>
            </div>
          )}

          <button
            type="button"
            onClick={() => setUnit((prev) => (prev === 'metric' ? 'imperial' : 'metric'))}
          >
            Switch to {unit === 'metric' ? 'Imperial (ft/in)' : 'Metric (cm)'}
          </button>
        </div>

        <div className="viz-window">
          <div className="viz-scene" style={{ height: `${sceneHeight}px` }}>
            <div className="bar-wrap">
              <div className="bar person" style={{ height: `${personBarPx}px` }} />
              <p>{personLabel}</p>
            </div>

            <div className="bar-wrap">
              <div className="bar tower" style={{ height: `${towerBarPx}px` }} />
              <p>{towerLabel}</p>
            </div>
          </div>
        </div>

        <p className="note">
          Scale: 1 cm = {pxPerCm.toFixed(4)} px (auto-adjusted to keep the person visible).
        </p>
      </section>
    </main>
  );
}

export default App;
