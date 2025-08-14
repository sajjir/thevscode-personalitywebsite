import smtplib
from email.mime.text import MIMEText
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
# فعال کردن CORS برای اینکه جاوااسکریپت بتواند به این سرور درخواست بفرستد
CORS(app)

# --- تنظیمات ایمیل ---
# ⚠️ هشدار: هرگز اطلاعات حساس را مستقیماً در کد قرار نده!
# این مقادیر را با اطلاعات خودت جایگزین کن.
# بهتر است از متغیرهای محیطی (Environment Variables) استفاده کنی.
SMTP_SERVER = 'smtp.gmail.com'  # برای جیمیل
SMTP_PORT = 587  # پورت TLS برای جیمیل
EMAIL_SENDER = 'your_email@gmail.com' # ایمیلی که با آن ارسال می‌کنی
EMAIL_PASSWORD = 'your_app_password'  # 🔑 پسورد اپلیکیشن جیمیل، نه پسورد اصلی!
EMAIL_RECIPIENT = 'your_email@gmail.com' # ایمیلی که پیام را دریافت می‌کند

@app.route('/send-email', methods=['POST'])
def send_email():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    message = data.get('message')

    if not all([name, email, message]):
        return jsonify({"message": "لطفاً تمام فیلدها را پر کنید."}), 400

    # ساخت بدنه ایمیل
    subject = f"پیام جدید از وب‌سایت شخصی از طرف {name}"
    body = f"""
    شما یک پیام جدید از پورتفولیو خود دریافت کردید:

    نام فرستنده: {name}
    ایمیل فرستنده: {email}

    متن پیام:
    {message}
    """

    try:
        # ساخت شیء ایمیل
        msg = MIMEText(body, 'plain', 'utf-8')
        msg['Subject'] = subject
        msg['From'] = EMAIL_SENDER
        msg['To'] = EMAIL_RECIPIENT

        # اتصال به سرور SMTP و ارسال
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()  # فعال کردن امنیت TLS
        server.login(EMAIL_SENDER, EMAIL_PASSWORD)
        server.sendmail(EMAIL_SENDER, EMAIL_RECIPIENT, msg.as_string())
        server.quit()
        
        return jsonify({"message": "پیام شما با موفقیت ارسال شد. ممنون!"}), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"message": "خطا در سرور. ارسال ایمیل با مشکل مواجه شد."}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)