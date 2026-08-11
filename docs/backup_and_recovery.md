# Backup & Recovery Strategy

This document outlines the requirements and procedures for data backup and disaster recovery in the CareerForge AI production environment.

**Note:** CareerForge AI is a stateless application backend. All persistent state is stored in MongoDB. Therefore, backup and recovery procedures are entirely focused on the database provider.

---

## 1. MongoDB Backup Strategy (Deployment Requirement)

To ensure data durability, the production MongoDB cluster **must** have automated backups enabled before the public launch. 

If using **MongoDB Atlas**:
1. Navigate to the Atlas Dashboard -> Clusters -> Backup.
2. Enable **Continuous Cloud Backups** (Point-in-Time Recovery).
3. Ensure the snapshot retention policy is set to a minimum of **7 days** for daily snapshots, and at least **1 month** for weekly snapshots.

*Failure to configure automated backups is a critical deployment blocker.*

---

## 2. Disaster Recovery Procedure

In the event of catastrophic data corruption (e.g., an accidental mass deletion or compromised database):

### 1. Halt the System
- Immediately scale the backend API workers to `0` or activate "Maintenance Mode" on the hosting provider to prevent further data corruption or state divergence.

### 2. Initiate Database Restore
1. Log into MongoDB Atlas.
2. Select the compromised cluster and navigate to the **Backup** tab.
3. Select a snapshot or point-in-time immediately prior to the corruption event.
4. Select **Restore to a New Cluster** (Recommended) or **Restore to Original Cluster**.
   - *Restoring to a new cluster is preferred as it preserves the corrupted state for forensic analysis.*

### 3. Webhook Reconciliation (Razorpay)
When restoring to a previous point in time, any subscription payments processed *after* the backup snapshot was taken will be lost from the database.

1. Log into the Razorpay Dashboard.
2. Export all successful `subscription.charged` events that occurred between the Backup Snapshot Time and the present.
3. Manually script or apply these subscription renewals to the restored database to ensure paid users do not lose PRO access.

### 4. Resume Service
- Once the database is restored and webhooks are reconciled, scale the backend API workers back to normal capacity.

---

## 5. AI Telemetry Data

AI Usage Telemetry (`AIUsageTelemetry` collection) is highly voluminous and strictly used for aggregate dashboard analytics.

In a disaster recovery scenario, partial loss of AI telemetry data is **acceptable** and should not block the restoration of the primary application. The primary focus must remain on `Users`, `Resumes`, `Subscriptions`, and `MonthlyUsages`.
