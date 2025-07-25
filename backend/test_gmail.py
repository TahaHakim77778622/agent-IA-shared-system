import smtplib
from email.mime.text import MIMEText

user = "th082919@gmail.com"
pwd =  "uwtq tioc kgjx fbjv"
to = "th082919@gmail.com"
msg = MIMEText("Test SMTP Gmail depuis FastAPI")
msg['Subject'] = "Test"
msg['From'] = user
msg['To'] = to

with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
    server.login(user, pwd)
    server.send_message(msg)