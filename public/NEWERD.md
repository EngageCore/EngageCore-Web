# iBizzTax System - Comprehensive Entity Relationship Diagram

## Overview

This ERD represents the complete iBizzTax system architecture, incorporating all three services:
- **iBizzTax Service** (MongoDB) - Main business logic and user management
- **iBizzTax Tax Engine** (PostgreSQL) - RAG system for tax rules
- **iBizzTax AI Service** - Multi-agent AI system for tax analysis

## Database Technologies
- **Primary Database**: MongoDB (iBizzTax-service)
- **Tax Rules Database**: PostgreSQL with pgvector (iBizzTax-tax-engine)
- **AI Service**: Stateless with external integrations

## Malaysian Tax Forms Support
- **Form C**: Corporate Income Tax Return

---

```mermaid
erDiagram
    %% CORE USER MANAGEMENT (MongoDB - iBizzTax-service)
    
    USER {
        ObjectId _id PK
        string firstName
        string lastName
        string email UK
        string password
        enum role "admin|tax_preparer|client"
        string phone
        object address
        date dateOfBirth
        string ssn
        boolean isActive
        date lastLogin
        string lastLoginIP
        string resetPasswordToken
        date resetPasswordExpire
        number creditBalance
        enum creditStatus "active|suspended|frozen"
        date lastCreditUpdate
        date createdAt
        date updatedAt
    }
    
    CLIENT {
        ObjectId _id PK
        string name
        string primeSolutions
        string companyRegistrationNumber
        string latestFinancialYear
        string contactEmail
        string contactFax
        enum ownership "General|Finance|Healthcare"
        string contactPerson
        string contactPhone
        string website
        object address
        boolean isActive
        ObjectId assignedPreparer FK
        date createdAt
        date updatedAt
    }
    
    CLIENT_DOCUMENT {
        ObjectId _id PK
        ObjectId client FK
        ObjectId user FK
        string documentName
        string fileName
        string filePath
        number fileSize
        string mimeType
        enum category
        string subCategory
        enum status "Pending|Available|Completed|In Progress"
        string description
        string taxYear
        boolean isRequired
        date dueDate
        date completedDate
        ObjectId uploadedBy FK
        ObjectId reviewedBy FK
        date reviewedAt
        array tags
        string notes
        number version
        array previousVersions
        boolean isConfidential
        enum accessLevel "public|internal|confidential|restricted"
        boolean isProcessed
        date processedAt
        mixed extractedData
        boolean isActive
        boolean isDeleted
        date deletedAt
        ObjectId deletedBy FK
        date createdAt
        date updatedAt
    }
    
    CLIENT_HISTORY {
        ObjectId _id PK
        ObjectId clientId FK
        string fieldName
        string fieldPath
        mixed previousValue
        mixed currentValue
        enum actionType "create|update|delete"
        ObjectId updatedBy FK
        date createdAt
    }
    
    USER_ACTION_LOG {
        ObjectId _id PK
        ObjectId userId FK
        string action
        string resource
        mixed details
        string ipAddress
        string userAgent
        date createdAt
    }
    
    USER_CREDIT_HISTORY {
        ObjectId _id PK
        ObjectId userId FK
        enum transactionType "credit|debit|status_change"
        number amount
        string description
        number balanceAfter
        mixed metadata
        ObjectId processedBy FK
        string transactionId UK
        date createdAt
        date updatedAt
    }
    
    %% TAX FILING ENTITIES (Future Implementation)
    
    TAX_FILING {
        ObjectId _id PK
        ObjectId clientId FK
        ObjectId userId FK
        ObjectId taxFormId FK
        number taxYear
        enum filingType "corporate|individual|partnership"
        enum filingStatus "draft|submitted|approved|rejected"
        enum submissionStatus "pending|submitted|acknowledged"
        enum workflowStep "upload|classify|extract|validate|analyze|form-c|tax-computation|preview|confirm|complete"
        number grossIncome
        number taxableIncome
        number totalDeductions
        number taxLiability
        number refundAmount
        object formData
        object extractedData
        object validationResults
        boolean previewGenerated
        date submissionDate
        date lhdnSubmissionDate
        string lhdnReferenceNumber
        boolean isSubmitted
        boolean isLhdnSubmitted
        date createdAt
        date updatedAt
    }
    
    TAX_FORM {
        ObjectId _id PK
        string formName
        string formCode UK "e.g., 'C'"
        string formVersion
        string description
        number taxYear
        enum formType "individual|corporate|partnership"
        object formSchema
        boolean isActive
        date createdAt
        date updatedAt
    }
    
    FORM_FIELD {
        ObjectId _id PK
        ObjectId taxFormId FK
        string fieldName
        string fieldCode
        string fieldType
        string fieldDescription
        object validationRules
        boolean isRequired
        number displayOrder
        string sectionName
        date createdAt
        date updatedAt
    }
    
    %% FINANCIAL DATA ENTITIES
    
    INCOME {
        ObjectId _id PK
        ObjectId taxFilingId FK
        ObjectId clientId FK
        enum incomeType "salary|business|investment|rental|other"
        string incomeSource
        number amount
        string currency
        date incomeDate
        string description
        object additionalData
        date createdAt
        date updatedAt
    }
    
    DEDUCTION {
        ObjectId _id PK
        ObjectId taxFilingId FK
        ObjectId clientId FK
        string taxRuleId FK
        enum deductionType "business|personal|charitable|medical"
        string deductionName
        number amount
        string currency
        string description
        object supportingData
        boolean isVerified
        date createdAt
        date updatedAt
    }
    
    ASSET {
        ObjectId _id PK
        ObjectId clientId FK
        ObjectId taxFilingId FK
        enum assetType "property|equipment|vehicle|investment"
        string assetName
        number purchasePrice
        number currentValue
        date purchaseDate
        date disposalDate
        number depreciation
        string description
        object assetDetails
        boolean isActive
        date createdAt
        date updatedAt
    }
    
    DEPENDENT {
        ObjectId _id PK
        ObjectId clientId FK
        string firstName
        string lastName
        date dateOfBirth
        enum relationship "spouse|child|parent|other"
        string socialSecurityNumber
        boolean isStudent
        boolean livedWithTaxpayer
        number supportAmount
        boolean isActive
        date createdAt
        date updatedAt
    }
    
    %% TAX RULES (PostgreSQL - iBizzTax-tax-engine)
    
    TAX_RULES {
        serial id PK
        varchar rule_id UK
        varchar section
        text title
        text content
        vector embedding
        jsonb metadata
        timestamp created_at
    }
    
    %% MALAYSIAN TAX FORMS
    
    FORM_C {
        ObjectId _id PK
        ObjectId taxFilingId FK
        ObjectId clientId FK
        string companyName
        string registrationNumber
        string taxFileNumber
        string companyType
        string registeredAddress
        number a1_businessIncomeMalaysia
        number a2_businessIncomeOutsideMalaysia
        number a3_aggregateBusinessIncome
        number a6_otherIncomeMalaysia
        number a7_otherIncomeOutsideMalaysia
        number a8_aggregateOtherIncome
        number a9_aggregateIncome
        number a18_chargeableIncome
        number b1_totalChargeableIncome
        number b3_totalIncomeTaxCharged
        number b10_taxPayable
        object additionalSections
        date assessmentYear
        date createdAt
        date updatedAt
    }
    
    %% TAX CALCULATION ENTITIES
    
    TAX_CALCULATION {
        ObjectId _id PK
        ObjectId taxFilingId FK
        ObjectId clientId FK
        enum calculationType "income|deduction|liability|refund"
        object inputData
        object calculationSteps
        number resultAmount
        object breakdown
        date calculationDate
        boolean isFinal
        date createdAt
        date updatedAt
    }
    
    %% AI SERVICE INTEGRATION ENTITIES
    
    AI_INTERACTION_LOG {
        ObjectId _id PK
        ObjectId userId FK
        ObjectId clientId FK
        ObjectId taxFilingId FK
        enum interactionType "chat|analysis|classification|workflow"
        enum agentType "welcome|classifier|analyzer|rag|workflow|help|chat"
        string sessionId
        text userQuery
        text assistantResponse
        object contextData
        object suggestions
        number processingTime
        enum status "success|error|timeout"
        string errorMessage
        date interactionDate
        enum feedbackRating "1|2|3|4|5"
        string feedbackComments
        date createdAt
    }
    
    AI_DOCUMENT_ANALYSIS {
        ObjectId _id PK
        ObjectId documentId FK
        ObjectId userId FK
        enum analysisType "classification|extraction|validation"
        object analysisResult
        number confidenceScore
        object extractedData
        array detectedCategories
        object metadata
        date analysisDate
        date createdAt
    }
    
    AI_WORKFLOW_STATE {
        ObjectId _id PK
        ObjectId userId FK
        ObjectId clientId FK
        string sessionId
        enum currentStep "welcome|document_upload|classification|analysis|review|submission"
        object workflowData
        object agentStates
        date lastActivity
        boolean isActive
        date createdAt
        date updatedAt
    }
    
    %% BUSINESS ENTITIES
    
    COMPANY {
        ObjectId _id PK
        ObjectId clientId FK
        string companyName
        string registrationNumber UK
        string taxId
        enum entityType "sdn_bhd|bhd|llp|partnership|sole_proprietor"
        object address
        date incorporationDate
        date fiscalYearEnd
        object companyDetails
        boolean isActive
        date createdAt
        date updatedAt
    }
    
    LLP {
        ObjectId _id PK
        ObjectId clientId FK
        string llpName
        string registrationNumber UK
        string taxId
        date establishmentDate
        object partnerDetails
        boolean isActive
        date createdAt
        date updatedAt
    }
    
    PARTNERSHIP {
        ObjectId _id PK
        ObjectId clientId FK
        string partnershipName
        string registrationNumber
        string taxId
        date establishmentDate
        object partnerDetails
        boolean isActive
        date createdAt
        date updatedAt
    }
    
    %% FINANCIAL STATEMENTS
    
    FINANCIAL_STATEMENT {
        ObjectId _id PK
        ObjectId clientId FK
        ObjectId documentId FK
        number financialYear
        enum statementType "balance_sheet|income_statement|cash_flow"
        object statementData
        number totalRevenue
        number totalExpenses
        number netProfit
        date statementDate
        date importedDate
        boolean isImported
        date createdAt
        date updatedAt
    }
    
    SSM_DOCUMENT {
        ObjectId _id PK
        ObjectId clientId FK
        ObjectId documentId FK
        string ssmNumber
        string companyName
        object ssmData
        date ssmDate
        date importedDate
        boolean isImported
        date createdAt
        date updatedAt
    }
    
    %% CREDIT MANAGEMENT
    
    CREDIT_TRANSACTION {
        ObjectId _id PK
        ObjectId userId FK
        enum transactionType "purchase|refund|bonus|penalty"
        number amount
        string currency
        string description
        string referenceNumber
        enum status "pending|completed|failed|cancelled"
        object paymentDetails
        date transactionDate
        date createdAt
        date updatedAt
    }
    
    E_INVOICE {
        ObjectId _id PK
        ObjectId userId FK
        ObjectId creditTransactionId FK
        string invoiceNumber
        number amount
        string currency
        object invoiceData
        string filePath
        enum status "draft|sent|paid|overdue|cancelled"
        date invoiceDate
        date dueDate
        date paidDate
        date createdAt
        date updatedAt
    }
    
    %% LHDN INTEGRATION
    
    LHDN_SUBMISSION {
        ObjectId _id PK
        ObjectId taxFilingId FK
        ObjectId userId FK
        string lhdnReferenceNumber
        object submissionData
        enum submissionStatus "pending|submitted|acknowledged|rejected"
        string statusMessage
        date submittedAt
        date acknowledgedAt
        object responseData
        date createdAt
        date updatedAt
    }
    
    %% REPORTING
    
    REPORT {
        ObjectId _id PK
        ObjectId userId FK
        ObjectId clientId FK
        ObjectId taxFilingId FK
        string reportName
        enum reportType "tax_summary|financial|compliance|audit"
        object reportParameters
        object reportData
        string filePath
        enum format "pdf|excel|csv|json"
        enum status "generating|completed|failed"
        date generatedAt
        boolean isScheduled
        date createdAt
        date updatedAt
    }
    
    %% NOTIFICATIONS
    
    NOTIFICATION {
        ObjectId _id PK
        ObjectId userId FK
        enum notificationType "info|warning|error|success"
        string title
        string message
        object data
        enum channel "email|sms|push|in_app"
        enum status "pending|sent|delivered|failed"
        date scheduledAt
        date sentAt
        date readAt
        boolean isRead
        date createdAt
        date updatedAt
    }
    
    %% AUDIT AND SECURITY
    
    AUDIT_LOG {
        ObjectId _id PK
        ObjectId userId FK
        string entityType
        ObjectId entityId
        enum actionType "create|read|update|delete"
        object oldValues
        object newValues
        string ipAddress
        string userAgent
        string sessionId
        date timestamp
        string description
    }
    
    SESSION {
        ObjectId _id PK
        ObjectId userId FK
        string sessionToken UK
        date expiresAt
        object sessionData
        string ipAddress
        string userAgent
        date lastAccessed
        boolean isActive
        date createdAt
    }
    
    PERMISSION {
        ObjectId _id PK
        string permissionName UK
        string resource
        string action
        string description
        date createdAt
        date updatedAt
    }
    
    USER_PERMISSION {
        ObjectId _id PK
        ObjectId userId FK
        ObjectId permissionId FK
        date grantedAt
        date expiresAt
        boolean isActive
    }
    
    USER_ACCESS {
        ObjectId _id PK
        ObjectId userId FK
        ObjectId clientId FK
        enum accessLevel "read|write|admin|owner"
        object permissions
        date grantedAt
        date expiresAt
        boolean isActive
        date createdAt
        date updatedAt
    }
    
    %% RELATIONSHIPS
    
    %% Core User Management
    USER ||--o{ CLIENT : "manages"
    USER ||--o{ CLIENT_DOCUMENT : "uploads"
    USER ||--o{ USER_ACTION_LOG : "performs"
    USER ||--o{ USER_CREDIT_HISTORY : "has"
    USER ||--o{ SESSION : "has"
    USER ||--o{ USER_PERMISSION : "granted"
    USER ||--o{ USER_ACCESS : "has"
    
    %% Client Relationships
    CLIENT ||--o{ CLIENT_DOCUMENT : "owns"
    CLIENT ||--o{ CLIENT_HISTORY : "tracked"
    CLIENT ||--o{ COMPANY : "can_be"
    CLIENT ||--o{ LLP : "can_be"
    CLIENT ||--o{ PARTNERSHIP : "can_be"
    CLIENT ||--o{ TAX_FILING : "files"
    CLIENT ||--o{ FINANCIAL_STATEMENT : "has"
    CLIENT ||--o{ SSM_DOCUMENT : "has"
    CLIENT ||--o{ USER_ACCESS : "grants"
    
    %% Tax Filing Relationships
    TAX_FILING ||--|| TAX_FORM : "uses"
    TAX_FILING ||--o{ INCOME : "includes"
    TAX_FILING ||--o{ DEDUCTION : "applies"
    TAX_FILING ||--o{ ASSET : "declares"
    TAX_FILING ||--o{ TAX_CALCULATION : "calculates"
    TAX_FILING ||--o{ LHDN_SUBMISSION : "submits"
    TAX_FILING ||--o{ REPORT : "generates"
    TAX_FILING ||--o{ FORM_C : "implements_for_corporate"
    
    %% Tax Form Relationships
    TAX_FORM ||--o{ FORM_FIELD : "contains"
    
    %% Document Relationships
    CLIENT_DOCUMENT ||--o{ FINANCIAL_STATEMENT : "contains"
    CLIENT_DOCUMENT ||--o{ SSM_DOCUMENT : "contains"
    CLIENT_DOCUMENT ||--o{ AI_DOCUMENT_ANALYSIS : "analyzed"
    
    %% AI Service Relationships
    USER ||--o{ AI_INTERACTION_LOG : "interacts"
    USER ||--o{ AI_WORKFLOW_STATE : "has"
    CLIENT ||--o{ AI_INTERACTION_LOG : "assisted"
    TAX_FILING ||--o{ AI_INTERACTION_LOG : "assisted"
    
    %% Credit Management Relationships
    USER ||--o{ CREDIT_TRANSACTION : "makes"
    CREDIT_TRANSACTION ||--o{ E_INVOICE : "generates"
    
    %% Permission Relationships
    PERMISSION ||--o{ USER_PERMISSION : "granted"
    
    %% Audit Relationships
    USER ||--o{ AUDIT_LOG : "tracked"
    CLIENT ||--o{ AUDIT_LOG : "tracked"
    TAX_FILING ||--o{ AUDIT_LOG : "tracked"
    CLIENT_DOCUMENT ||--o{ AUDIT_LOG : "tracked"
    
    %% Notification Relationships
    USER ||--o{ NOTIFICATION : "receives"
    
    %% Reporting Relationships
    USER ||--o{ REPORT : "generates"
    CLIENT ||--o{ REPORT : "subject"
    TAX_FILING ||--o{ REPORT : "based_on"
```

---

## Key Features of This ERD

### 1. **Multi-Database Architecture**
- **MongoDB**: Primary application data (users, clients, documents)
- **PostgreSQL**: Tax rules with vector embeddings for RAG
- **Stateless AI Service**: External API integrations

### 2. **Current Implementation Status**
- ✅ **Implemented**: USER, CLIENT, CLIENT_DOCUMENT, CLIENT_HISTORY, USER_ACTION_LOG, USER_CREDIT_HISTORY
- ✅ **Implemented**: TAX_RULES (PostgreSQL)
- 🔄 **Partial**: AI service entities (logging and workflow tracking)
- 🔄 **In Progress**: Form C (Corporate Income Tax) implementation
- ⏳ **Planned**: Tax filing, calculations, LHDN integration

### 3. **AI Service Integration**
- **AI_INTERACTION_LOG**: Tracks all AI agent interactions
- **AI_DOCUMENT_ANALYSIS**: Stores document analysis results
- **AI_WORKFLOW_STATE**: Manages multi-agent workflow states

### 4. **Enhanced Features**
- **Credit Management**: Complete transaction and invoice tracking
- **Audit Trail**: Comprehensive logging for compliance
- **Permission System**: Role-based access control
- **Document Versioning**: Full document lifecycle management
- **LHDN Integration**: Malaysian tax authority submission tracking

### 5. **Data Types and Constraints**
- **ObjectId**: MongoDB primary keys
- **Enums**: Controlled vocabularies for status fields
- **Objects**: Flexible JSON storage for complex data
- **Vectors**: PostgreSQL pgvector for semantic search
- **Timestamps**: Automatic creation and update tracking

### 6. **Scalability Considerations**
- **Indexes**: Optimized for common query patterns
- **Partitioning**: Large tables can be partitioned by date/client
- **Caching**: Frequently accessed data can be cached
- **Microservices**: Each service manages its own data domain

---

## Implementation Priority

### Phase 1 (Current)
- ✅ User and Client management
- ✅ Document upload and tracking
- ✅ Credit system
- ✅ Tax rules RAG system
- ✅ AI service integration

### Phase 2 (Next)
- 🔄 Tax filing entities
- 🔄 Form C implementation
- 🔄 Tax calculation engine
- 🔄 AI interaction logging
- 🔄 Basic reporting

### Phase 3 (Future)
- ⏳ LHDN integration
- ⏳ Advanced analytics
- ⏳ Mobile app support
- ⏳ Third-party integrations

---

## Notes

1. **Foreign Key Relationships**: In MongoDB, foreign keys are implemented as ObjectId references with application-level constraints.

2. **Vector Search**: The TAX_RULES table in PostgreSQL uses pgvector extension for semantic similarity search.

3. **Audit Trail**: All major entities have corresponding audit logs for compliance and debugging.

4. **Soft Deletes**: Most entities use soft delete patterns (isDeleted, deletedAt) rather than hard deletes.

5. **Extensibility**: The schema is designed to accommodate future Malaysian tax regulations and business requirements.

This ERD provides a comprehensive foundation for the iBizzTax system while maintaining flexibility for future enhancements and regulatory changes.