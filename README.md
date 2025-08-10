# OpenObserveAssignment

This repository contains:

- **Playwright Test Automation Framework** for UI testing of OpenObserve.  
- **Pytest API Automation Framework** for validating OpenObserve API endpoints.

---

## 📦 Project Structure

```
OPENOBSERVEASSIGNMENT/
├── tests/
│   └── dashboardTests.spec.js              # Playwright UI test scripts
├── api-tests/
│   └── test_search_api.py                   # Pytest API test script
├── support/
│   ├── pages/
│   │   ├── loginPage.js
│   │   └── logsPage.js
│   ├── locators/
│   │   └── logsPageLocators.js
│   └── UiHelper/
│       └── helperFunctions.js
├── data/
│   └── logs.json                            # Sample logs data for seeding
├── playwright-report/
├── test-results/
├── global-setup.js                          # Starts local server & seeds data
├── global-teardown.js                       # Stops server after tests
├── playwright.config.js
├── package.json
├── package-lock.json
└── README.md
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository
```sh
git clone <repo-url>
cd OpenObserveAssignment
```

### 2️⃣ Install & Configure OpenObserve Locally  
Follow the **self-hosted installation** guide:  
[OpenObserve Installation Guide](https://openobserve.ai/docs/getting-started/)

### 3️⃣ Seed Sample Data
Once the local OpenObserve server is running, use the provided `logs.json` to seed data.

```powershell
$credPair = "root@example.com:Complexpass#123"
$bytes = [System.Text.Encoding]::ASCII.GetBytes($credPair)
$encodedCreds = [Convert]::ToBase64String($bytes)
$headers = @{
    Authorization = "Basic $encodedCreds"
    "Content-Type" = "application/json"
}

Invoke-RestMethod -Uri "http://localhost:5080/api/default/default/_json" `
    -Method Post `
    -Headers $headers `
    -InFile "logs.json"
```

### 4️⃣ Install Playwright Dependencies
```sh
npm install
```

### 5️⃣ API Test Setup (Pytest)
```sh
cd api-tests
python -m venv venv
venv\Scripts\activate   # Windows
# source venv/bin/activate   # macOS/Linux
pip install pytest requests python-dotenv
```

---

## ▶ Running Tests

### **UI Automation (Playwright)**
Pass credentials at runtime to avoid storing them locally:

```powershell
$env:EMAIL="root@example.com"; $env:PASSWORD="Complexpass#123"; npx playwright test --headed
```

### **API Automation (Pytest)**
```sh
pytest -v test_search_api.py
```

---

## ✅ Scenarios Automated (UI)

1. Navigate to Logs from menu and select the `default` stream.  
2. Select **Line Chart** for visualization.  
3. Remove existing Y-axis field items.  
4. Search and add new fields to graph parameters.  
5. Add line chart to the dashboard.  
6. Create a new dashboard from line charts.  
7. Edit dashboard → Enable **Connect Null Values** setting.  
8. Verify chart rendering & canvas loading after enabling **Connect Null Values**.  
9. Edit dashboard → Enable **Others Series** setting.  
10. Verify chart rendering & canvas loading after enabling **Others Series**.  
11. Validate **Others Series** using canvas screenshot & parsed text from screenshot.

---

## 📚 External Libraries Used

### **UI Framework**
- [Playwright](https://playwright.dev) — UI automation framework

### **Utilities**
- [Tesseract.js](https://github.com/naptha/tesseract.js) — OCR for parsing chart screenshots  
- [node-fetch](https://github.com/node-fetch/node-fetch) — API requests within Node.js scripts  

### **API Framework**
- [pytest](https://docs.pytest.org) — Python test framework  
- [requests](https://docs.python-requests.org) — HTTP client  
- [python-dotenv](https://pypi.org/project/python-dotenv/) — Environment variable management  

---

## 📄 Notes
- This framework supports both **UI and API** testing in one repository.  
- Sensitive credentials should **not** be stored in `.env` or committed to the repository.  
- Credentials are passed securely via **runtime environment variables**.
