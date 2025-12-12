# Admin Dashboard - Metriken Übersicht

## Datenquellen

| Tabelle | Beschreibung | Wann wird erstellt? |
|---------|--------------|---------------------|
| `user_stats` | User-Statistiken (total_workflows, current_streak, last_used_at) | Beim ersten Workflow-Use (via `recordUsage()`) |
| `user_usage` | Jede einzelne Workflow-Nutzung | Bei jedem Workflow-Use |
| `subscriptions` | Pro-Abonnements | Bei Pro-Upgrade via Lemon Squeezy |
| `workflows` | Workflow-Definitionen | Manuell erstellt |

---

## ROW 1: USER METRICS

### 1. Total Active Users
- **Quelle:** `user_stats` (COUNT)
- **Berechnung:** Anzahl aller Einträge in `user_stats`
- **Bedeutung:** User, die mindestens 1x einen Workflow genutzt haben
- **⚠️ Hinweis:** Zählt NICHT alle Sign-ups, nur aktive User

### 2. New Active Users
- **Quelle:** `user_stats` (WHERE created_at >= 7 Tage)
- **Berechnung:** Anzahl Einträge mit `created_at` in letzten 7 Tagen
- **Bedeutung:** User, die in den letzten 7 Tagen zum ersten Mal einen Workflow genutzt haben
- **⚠️ Hinweis:** Nicht "neue Sign-ups", sondern "neue aktive User"

### 3. Active Users
- **Quelle:** `user_usage` (WHERE used_at >= 30 Tage)
- **Berechnung:** `COUNT(DISTINCT user_id)` aus `user_usage` (letzte 30 Tage)
- **Bedeutung:** Eindeutige User, die in den letzten 30 Tagen mindestens 1 Workflow genutzt haben

### 4. Pro Users
- **Quelle:** `subscriptions` (WHERE status = 'active')
- **Berechnung:** COUNT aller aktiven Subscriptions
- **Bedeutung:** User mit aktivem Pro-Abo
- **Prozent:** `(proUsers / totalUsers) * 100`

---

## ROW 2: USAGE METRICS

### 5. Total Runs
- **Quelle:** `user_usage` (WHERE used_at >= gewählter Zeitraum)
- **Berechnung:** COUNT aller Einträge im gewählten Zeitraum
- **Bedeutung:** Gesamtanzahl aller Workflow-Ausführungen
- **Zeitraum:** Abhängig von Filter (Today, 7 Days, 30 Days, All Time)

### 6. Runs per User
- **Berechnung:** `totalRunsInPeriod / activeUsers`
- **Bedeutung:** Durchschnittliche Workflow-Nutzung pro aktivem User
- **⚠️ Hinweis:** Nur für aktive User (30 Tage) berechnet

### 7. Returning Users
- **Quelle:** `user_usage` (WHERE used_at >= 30 Tage)
- **Berechnung:**
  1. Gruppiere nach `user_id` und zähle eindeutige Tage (`used_at` als Datum)
  2. Filtere User mit 2+ verschiedenen Tagen
  3. COUNT dieser User
- **Bedeutung:** User, die an mindestens 2 verschiedenen Tagen aktiv waren
- **Prozent:** `(returningUsers / activeUsers) * 100`

### 8. Activation Rate
- **Quelle:** 
  - `user_stats` (totalUsers)
  - `user_usage` (alle User mit mind. 1 Nutzung)
- **Berechnung:** `(uniqueUsersWithUsage / totalUsers) * 100`
- **Bedeutung:** Prozent der User, die jemals einen Workflow genutzt haben
- **⚠️ Hinweis:** Da `totalUsers` nur aktive User zählt, ist das immer ~100%

---

## ROW 3: CHARTS

### 9. Daily Usage (14 Tage)
- **Quelle:** `user_usage` (WHERE used_at >= 14 Tage)
- **Berechnung:**
  1. Gruppiere nach Datum (`used_at` als YYYY-MM-DD)
  2. COUNT pro Tag
  3. Fülle fehlende Tage mit 0
- **Anzeige:** Balkendiagramm mit Gesamt-Runs pro Tag

### 10. Top Workflows (30 Tage)
- **Quelle:** 
  - `user_usage` (WHERE used_at >= 30 Tage)
  - `workflows` (JOIN für Titel/Icon)
- **Berechnung:**
  1. Gruppiere nach `workflow_id` und COUNT
  2. Sortiere absteigend
  3. Top 5
  4. JOIN mit `workflows` für Details
- **Anzeige:** Liste mit Icon, Titel, Count

### 11. User Engagement Distribution
- **Quelle:** `user_usage` (WHERE used_at >= 30 Tage)
- **Berechnung:**
  1. Zähle Runs pro User (`COUNT(user_id) GROUP BY user_id`)
  2. Kategorisiere in Tiers:
     - 1 run
     - 2-5 runs
     - 6-10 runs
     - 10+ runs
  3. Berechne Prozent pro Tier
- **Anzeige:** Progress Bars mit Prozent-Verteilung

---

## ROW 4: LISTS

### 12. New Active Users (Liste)
- **Quelle:** `user_stats` (WHERE created_at >= 7 Tage)
- **Berechnung:** SELECT user_id, created_at ORDER BY created_at DESC LIMIT 10
- **Anzeige:** Liste mit User-ID (gekürzt) und relativer Zeit
- **⚠️ Hinweis:** Zeigt User, die zum ersten Mal aktiv wurden

### 13. Pro Conversions (Liste)
- **Quelle:** `subscriptions` (WHERE status = 'active' AND created_at >= 30 Tage)
- **Berechnung:** SELECT user_id, plan_type, created_at ORDER BY created_at DESC LIMIT 10
- **Anzeige:** Liste mit User-ID, Plan-Type (monthly/annual), relative Zeit

---

## Wichtige Hinweise

### ⚠️ Sign-ups vs. Active Users

**Problem:** 
- Echte Sign-ups sind in `auth.users` (Supabase Auth)
- Diese Tabelle ist nicht direkt via SQL zugänglich
- `user_stats` wird erst beim ersten Workflow-Use erstellt

**Aktuelle Lösung:**
- Wir zählen "Active Users" (User mit mind. 1 Workflow-Use)
- Das ist für Produktmetriken oft aussagekräftiger als reine Sign-ups

**Für echte Sign-up-Zahlen:**
- Option 1: Supabase Database Function erstellen, die `auth.users` zugänglich macht
- Option 2: Supabase Admin API verwenden (komplexer)

### ⚠️ Zeiträume

- **7 Tage:** Für "New Users" und "New Signups"
- **30 Tage:** Für "Active Users", "Top Workflows", "Engagement", "Pro Conversions"
- **14 Tage:** Für "Daily Usage" Chart
- **Gewählter Zeitraum:** Für "Total Runs" (abhängig von Filter)

### ⚠️ Performance

- Alle Queries werden parallel ausgeführt (`Promise.all`)
- `user_usage` wird mehrfach abgefragt (könnte optimiert werden)
- Für große Datenmengen: Indizes auf `used_at` und `user_id` wichtig

---

## SQL-äquivalente Queries

```sql
-- Total Active Users
SELECT COUNT(*) FROM user_stats;

-- New Active Users (7 Tage)
SELECT COUNT(*) FROM user_stats 
WHERE created_at >= NOW() - INTERVAL '7 days';

-- Active Users (30 Tage)
SELECT COUNT(DISTINCT user_id) FROM user_usage 
WHERE used_at >= NOW() - INTERVAL '30 days';

-- Pro Users
SELECT COUNT(*) FROM subscriptions 
WHERE status = 'active';

-- Total Runs (Zeitraum)
SELECT COUNT(*) FROM user_usage 
WHERE used_at >= [periodStart];

-- Returning Users (30 Tage)
WITH user_days AS (
  SELECT user_id, DATE(used_at) as day
  FROM user_usage
  WHERE used_at >= NOW() - INTERVAL '30 days'
  GROUP BY user_id, DATE(used_at)
)
SELECT COUNT(DISTINCT user_id) 
FROM (
  SELECT user_id, COUNT(DISTINCT day) as days_count
  FROM user_days
  GROUP BY user_id
  HAVING COUNT(DISTINCT day) >= 2
) returning_users;
```

