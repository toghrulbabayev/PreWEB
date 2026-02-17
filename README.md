# EvUsta MVP (clean modular frontend)

Bu versiyada `app.js` təmizlənib və kod hissələrə bölünüb:

- `js/config/` → sabitlər
- `js/state/` → storage/store
- `js/services/` → auth, worker, booking logic
- `js/ui/` → DOM və render
- `js/controllers/` → event orchestration
- `app.js` → yalnız entry point

## Necə işə salım? (localhost:3000)
1. Terminalda layihə qovluğuna keçin.
2. Serveri açın:
   ```bash
   python3 -m http.server 3000
   ```
3. Brauzerdə açın:
   - `http://localhost:3000`

## Demo hesablar
- Customer: `customer@demo.az` / `1234`
- Provider: `aysel@demo.az` / `1234`

Qeyd: məlumatlar localStorage-da saxlanılır. Sıfırlamaq üçün browser storage təmizləyin.
