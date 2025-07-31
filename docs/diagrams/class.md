# Diagramme de Classe - ProMail Assistant

## 1. Diagramme de Classe Principal

```mermaid
classDiagram
    class User {
        +int id
        +string email
        +string password_hash
        +string first_name
        +string last_name
        +datetime created_at
        +datetime updated_at
        +boolean is_active
        +boolean email_verified
        +string two_factor_secret
        +boolean two_factor_enabled
        +login()
        +logout()
        +updateProfile()
        +changePassword()
        +enable2FA()
        +disable2FA()
    }
    
    class Email {
        +int id
        +int user_id
        +string subject
        +text content
        +string email_type
        +string recipient
        +string company
        +string tone
        +string urgency
        +boolean is_favorite
        +json metadata
        +datetime created_at
        +datetime updated_at
        +datetime sent_at
        +string status
        +generate()
        +save()
        +update()
        +delete()
        +export()
        +share()
    }
    
    class Template {
        +int id
        +int user_id
        +string name
        +text content
        +string category
        +boolean is_public
        +json metadata
        +datetime created_at
        +datetime updated_at
        +int usage_count
        +float rating
        +create()
        +update()
        +delete()
        +use()
        +rate()
        +share()
    }
    
    class LoginHistory {
        +int id
        +int user_id
        +datetime login_time
        +string ip_address
        +text user_agent
        +boolean success
        +string failure_reason
        +string location
        +string device_type
        +log()
        +getUserLogs()
        +cleanupOldLogs()
    }
    
    class UserPreferences {
        +int id
        +int user_id
        +json settings
        +string language
        +string timezone
        +boolean email_notifications
        +boolean push_notifications
        +datetime updated_at
        +updateSettings()
        +getSettings()
        +resetToDefault()
    }
    
    class EmailAnalytics {
        +int id
        +int email_id
        +int user_id
        +string action
        +datetime action_time
        +json metadata
        +string session_id
        +track()
        +getUserAnalytics()
        +getEmailAnalytics()
        +generateReport()
    }
    
    class ApiKey {
        +int id
        +int user_id
        +string key_hash
        +string name
        +boolean is_active
        +datetime created_at
        +datetime last_used
        +datetime expires_at
        +generate()
        +validate()
        +revoke()
        +updateLastUsed()
    }
    
    class SecurityManager {
        +validateToken()
        +generateJWT()
        +hashPassword()
        +verifyPassword()
        +generate2FASecret()
        +verify2FACode()
        +logAccess()
        +checkPermissions()
    }
    
    class EmailGenerator {
        +generateEmail()
        +validateInput()
        +createPrompt()
        +processAIResponse()
        +formatEmail()
        +saveToDatabase()
    }
    
    class ExportService {
        +exportToWord()
        +exportToPDF()
        +exportToExcel()
        +exportToEmail()
        +generateShareLink()
        +sendToSlack()
        +sendToTeams()
    }
    
    class NotificationService {
        +sendEmail()
        +sendPushNotification()
        +sendSMS()
        +scheduleNotification()
        +cancelNotification()
    }
    
    class AnalyticsService {
        +trackEvent()
        +generateReport()
        +calculateMetrics()
        +exportData()
        +setAlerts()
    }
    
    class CacheManager {
        +get()
        +set()
        +delete()
        +clear()
        +isExpired()
        +refresh()
    }
    
    class Logger {
        +debug()
        +info()
        +warn()
        +error()
        +fatal()
        +logToDatabase()
        +sendToExternal()
    }
    
    User ||--o{ Email : "generates"
    User ||--o{ Template : "creates"
    User ||--o{ LoginHistory : "logs"
    User ||--|| UserPreferences : "has"
    User ||--o{ ApiKey : "owns"
    User ||--o{ EmailAnalytics : "tracks"
    
    Email ||--o{ EmailAnalytics : "analyzed"
    
    SecurityManager --> User : "manages"
    EmailGenerator --> Email : "creates"
    ExportService --> Email : "exports"
    NotificationService --> User : "notifies"
    AnalyticsService --> EmailAnalytics : "processes"
    CacheManager --> User : "caches"
    Logger --> LoginHistory : "logs"
```

## 2. Diagramme de Classe - Frontend Components

```mermaid
classDiagram
    class App {
        +Router router
        +ThemeProvider theme
        +AuthProvider auth
        +render()
        +handleRouteChange()
    }
    
    class Dashboard {
        +User user
        +Email[] emails
        +Template[] templates
        +string currentView
        +render()
        +switchView()
        +loadData()
        +handleLogout()
    }
    
    class EmailGenerator {
        +EmailForm formData
        +string emailType
        +boolean isGenerating
        +Email generatedEmail
        +handleSubmit()
        +handleTypeChange()
        +generateEmail()
        +saveEmail()
        +exportEmail()
    }
    
    class EmailForm {
        +string subject
        +string content
        +string recipient
        +string company
        +string tone
        +string urgency
        +validate()
        +reset()
        +updateField()
    }
    
    class ChatBotModal {
        +Message[] messages
        +boolean isOpen
        +string currentInput
        +handleSend()
        +handleExport()
        +sendToGenerator()
        +close()
    }
    
    class Message {
        +string id
        +string content
        +string role
        +datetime timestamp
        +json metadata
    }
    
    class TemplateManager {
        +Template[] templates
        +string searchTerm
        +string selectedCategory
        +createTemplate()
        +updateTemplate()
        +deleteTemplate()
        +searchTemplates()
        +useTemplate()
    }
    
    class HistoryView {
        +Email[] emails
        +FilterOptions filters
        +string searchTerm
        +boolean showFavorites
        +loadEmails()
        +filterEmails()
        +searchEmails()
        +toggleFavorite()
        +exportEmails()
    }
    
    class FilterOptions {
        +string type
        +string dateRange
        +string recipient
        +string company
        +boolean isFavorite
        +apply()
        +reset()
        +toQueryString()
    }
    
    class StatsView {
        +UserStats stats
        +ChartData[] charts
        +string period
        +loadStats()
        +updatePeriod()
        +exportReport()
        +generateChart()
    }
    
    class UserStats {
        +int totalEmails
        +int emailsThisMonth
        +string mostUsedType
        +float averageResponseTime
        +RecipientStats[] topRecipients
        +CompanyStats[] topCompanies
        +calculate()
    }
    
    class SecurityView {
        +boolean twoFactorEnabled
        +Session[] activeSessions
        +LogEntry[] accessLogs
        +GDPRSettings gdprSettings
        +enable2FA()
        +disable2FA()
        +terminateSession()
        +exportData()
        +deleteData()
    }
    
    class OnboardingModal {
        +int currentStep
        +boolean[] completedSteps
        +OnboardingStep[] steps
        +nextStep()
        +previousStep()
        +skipOnboarding()
        +completeOnboarding()
    }
    
    class OnboardingStep {
        +int id
        +string title
        +string description
        +string icon
        +string color
        +string[] features
        +render()
    }
    
    class Navbar {
        +User user
        +boolean isDarkMode
        +string currentTheme
        +toggleTheme()
        +handleLogout()
        +navigateTo()
    }
    
    class Footer {
        +render()
        +scrollToTop()
    }
    
    class AnimatedLogo {
        +string size
        +boolean showText
        +boolean isAnimating
        +startAnimation()
        +stopAnimation()
        +render()
    }
    
    class LoadingSpinner {
        +string text
        +string size
        +render()
    }
    
    class LazyLoader {
        +boolean isVisible
        +boolean hasLoaded
        +int delay
        +float threshold
        +observe()
        +load()
        +render()
    }
    
    App --> Dashboard : "contains"
    App --> Navbar : "contains"
    App --> Footer : "contains"
    
    Dashboard --> EmailGenerator : "contains"
    Dashboard --> TemplateManager : "contains"
    Dashboard --> HistoryView : "contains"
    Dashboard --> StatsView : "contains"
    Dashboard --> SecurityView : "contains"
    Dashboard --> OnboardingModal : "contains"
    Dashboard --> ChatBotModal : "contains"
    
    EmailGenerator --> EmailForm : "uses"
    ChatBotModal --> Message : "contains"
    HistoryView --> FilterOptions : "uses"
    StatsView --> UserStats : "displays"
    SecurityView --> Session : "manages"
    SecurityView --> LogEntry : "displays"
    SecurityView --> GDPRSettings : "manages"
    OnboardingModal --> OnboardingStep : "contains"
    
    Navbar --> AnimatedLogo : "contains"
    Navbar --> User : "displays"
```

## 3. Diagramme de Classe - Services et Utils

```mermaid
classDiagram
    class ApiClient {
        +string baseUrl
        +string token
        +get()
        +post()
        +put()
        +delete()
        +setAuthToken()
        +handleResponse()
        +handleError()
    }
    
    class AuthService {
        +User currentUser
        +string token
        +boolean isAuthenticated
        +login()
        +logout()
        +register()
        +refreshToken()
        +forgotPassword()
        +resetPassword()
        +updateProfile()
    }
    
    class EmailService {
        +generateEmail()
        +saveEmail()
        +updateEmail()
        +deleteEmail()
        +getEmails()
        +searchEmails()
        +exportEmail()
        +shareEmail()
    }
    
    class TemplateService {
        +createTemplate()
        +updateTemplate()
        +deleteTemplate()
        +getTemplates()
        +searchTemplates()
        +useTemplate()
        +rateTemplate()
        +shareTemplate()
    }
    
    class ExportService {
        +exportToWord()
        +exportToPDF()
        +exportToExcel()
        +exportToEmail()
        +generateShareLink()
        +sendToSlack()
        +sendToTeams()
        +validateFormat()
    }
    
    class NotificationService {
        +showToast()
        +showAlert()
        +showConfirm()
        +showModal()
        +hideModal()
        +scheduleNotification()
        +cancelNotification()
    }
    
    class StorageService {
        +set()
        +get()
        +remove()
        +clear()
        +has()
        +getAll()
    }
    
    class ValidationService {
        +validateEmail()
        +validatePassword()
        +validateForm()
        +sanitizeInput()
        +formatDate()
        +formatPhone()
    }
    
    class PerformanceService {
        +trackPageLoad()
        +trackUserAction()
        +trackError()
        +sendMetrics()
        +calculateFCP()
        +calculateLCP()
        +calculateCLS()
    }
    
    class LoggerService {
        +debug()
        +info()
        +warn()
        +error()
        +fatal()
        +logToServer()
        +logToConsole()
    }
    
    class ThemeService {
        +string currentTheme
        +string[] availableThemes
        +setTheme()
        +getTheme()
        +toggleTheme()
        +isDarkMode()
    }
    
    class PWAService {
        +boolean isInstalled
        +boolean isOnline
        +install()
        +uninstall()
        +checkForUpdates()
        +syncData()
        +showOfflineMessage()
    }
    
    class AnalyticsService {
        +trackEvent()
        +trackPageView()
        +trackUser()
        +generateReport()
        +exportData()
        +setGoals()
    }
    
    class SecurityService {
        +validateToken()
        +encryptData()
        +decryptData()
        +generateHash()
        +verifyHash()
        +sanitizeInput()
        +preventXSS()
    }
    
    ApiClient --> AuthService : "uses"
    ApiClient --> EmailService : "uses"
    ApiClient --> TemplateService : "uses"
    
    AuthService --> StorageService : "uses"
    AuthService --> ValidationService : "uses"
    
    EmailService --> ExportService : "uses"
    EmailService --> NotificationService : "uses"
    
    TemplateService --> ValidationService : "uses"
    
    ExportService --> NotificationService : "uses"
    
    PerformanceService --> LoggerService : "uses"
    PerformanceService --> AnalyticsService : "uses"
    
    ThemeService --> StorageService : "uses"
    
    PWAService --> StorageService : "uses"
    PWAService --> NotificationService : "uses"
    
    SecurityService --> ValidationService : "uses"
    SecurityService --> LoggerService : "uses"
```

## 4. Diagramme de Classe - Hooks et Context

```mermaid
classDiagram
    class AuthContext {
        +User user
        +boolean loading
        +boolean isAuthenticated
        +login()
        +logout()
        +refreshUser()
        +updateUser()
    }
    
    class EmailContext {
        +Email[] emails
        +boolean loading
        +string error
        +loadEmails()
        +addEmail()
        +updateEmail()
        +deleteEmail()
        +searchEmails()
    }
    
    class TemplateContext {
        +Template[] templates
        +boolean loading
        +string error
        +loadTemplates()
        +addTemplate()
        +updateTemplate()
        +deleteTemplate()
        +searchTemplates()
    }
    
    class ThemeContext {
        +string theme
        +boolean isDark
        +toggleTheme()
        +setTheme()
        +getTheme()
    }
    
    class NotificationContext {
        +Notification[] notifications
        +addNotification()
        +removeNotification()
        +clearNotifications()
        +showToast()
    }
    
    class useAuth {
        +User user
        +boolean loading
        +login()
        +logout()
        +refreshUser()
    }
    
    class useEmails {
        +Email[] emails
        +boolean loading
        +loadEmails()
        +addEmail()
        +updateEmail()
        +deleteEmail()
    }
    
    class useTemplates {
        +Template[] templates
        +boolean loading
        +loadTemplates()
        +addTemplate()
        +updateTemplate()
        +deleteTemplate()
    }
    
    class useTheme {
        +string theme
        +boolean isDark
        +toggleTheme()
        +setTheme()
    }
    
    class useNotifications {
        +showToast()
        +showAlert()
        +showConfirm()
        +showModal()
    }
    
    class usePerformance {
        +trackPageLoad()
        +trackUserAction()
        +trackError()
        +sendMetrics()
    }
    
    class useLogger {
        +debug()
        +info()
        +warn()
        +error()
        +fatal()
    }
    
    AuthContext --> useAuth : "provides"
    EmailContext --> useEmails : "provides"
    TemplateContext --> useTemplates : "provides"
    ThemeContext --> useTheme : "provides"
    NotificationContext --> useNotifications : "provides"
    
    useAuth --> AuthContext : "consumes"
    useEmails --> EmailContext : "consumes"
    useTemplates --> TemplateContext : "consumes"
    useTheme --> ThemeContext : "consumes"
    useNotifications --> NotificationContext : "consumes"
    
    usePerformance --> PerformanceService : "uses"
    useLogger --> LoggerService : "uses"
``` 