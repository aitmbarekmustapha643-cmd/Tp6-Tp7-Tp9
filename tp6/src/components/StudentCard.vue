body {
  font-family: system-ui, sans-serif;
  max-width: 680px;
  margin: 40px auto;
  padding: 0 16px;
  color: #1b2430;
}

nav {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 1px solid #dde1d9;
}
nav a { color: #2f8f66; text-decoration: none; font-weight: 600; }

.toolbar { display: flex; gap: 10px; margin-bottom: 18px; flex-wrap: wrap; }
.toolbar input, .toolbar select { padding: 6px 8px; }

form {
  border: 1px solid #dde1d9;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
form input, form select { padding: 6px 8px; }

.student-card {
  border: 1px solid #dde1d9;
  border-radius: 8px;
  padding: 10px 14px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.filiere-badge {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 999px;
  background: #e4f2ec;
  color: #2f8f66;
  font-weight: 600;
}

.fiche label { display: block; margin: 10px 0; }
.fiche input, .fiche select { padding: 6px 8px; margin-left: 8px; }
