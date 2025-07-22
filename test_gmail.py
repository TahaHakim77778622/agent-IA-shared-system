import smtplib
from email.mime.text import MIMEText

smtp_user = "th082919@gmail.com"
smtp_password = "ibnd ssmx gzza ifpq"
to = "th082919@gmail.com"
msg = MIMEText("Test SMTP depuis Python")
msg["Subject"] = "Test SMTP"
msg["From"] = smtp_user
msg["To"] = to

with smtplib.SMTP("smtp.gmail.com", 587) as server:
    server.starttls()
    server.login(smtp_user, smtp_password)
    server.sendmail(smtp_user, [to], msg.as_string())
print("Email envoyé (si pas d'erreur ci-dessus)") 