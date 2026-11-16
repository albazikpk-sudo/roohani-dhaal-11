# روحانی ڈھال
**مؤلف: مفتی محمد سہیل البازی**

## اس ZIP کا دائرہ
یہ پیکیج Android اور آف لائن ویب ایپ کی build تیاری ہے۔ `data/duas.json` میں 70 اندراجات ہیں۔ مذہبی متن، حوالہ، تعداد اور درجۂ صحت کو اس اپڈیٹ میں اپنی طرف سے تبدیل نہیں کیا گیا۔

## تحقیقی حیثیت
موجودہ فائلوں کے مطابق 16 اندراجات پر غیر تحقیق باقی کا لیبل نہیں، جبکہ 54 اندراجات `تحقیق باقی` یا مزید تحقیق کے محتاج ہیں۔ 200 منفرد اور مکمل طور پر ماخذ سے مقابلہ شدہ دعاؤں کا ہدف ابھی پورا نہیں۔ اس لیے اس پیکیج کو تکنیکی بیٹا سمجھیں؛ علمی تکمیل کا دعویٰ نہیں۔

## خصوصیات
- مقامی JSON مواد، تلاش، زمرے اور پسندیدہ
- پہلی بار لوڈ ہونے کے بعد offline precache
- Service Worker ہر build پر موجودہ `dist` assets کی فہرست بناتا ہے
- Capacitor Android 8.6.2، Android API 24+ support، target/compile API 36
- AdMob plugin اور UMP consent flow؛ حقیقی IDs GitHub Repository Variables سے فراہم کرنا ہوں گی
- R8 code shrinking/minification فعال
- PWA کے لیے نسبتاً (relative) asset paths، تاکہ GitHub Pages subpath پر بھی چل سکے

## Android Build
GitHub Actions میں `Build Roohani Dhaal Android` workflow چلائیں۔ Build APK اور AAB artifacts بنائے گا۔ Google Play پر اپلوڈ کے لیے signed AAB درکار ہے۔

## لازمی GitHub Repository Variables
- `ADMOB_APP_ID`: آپ کے اپنے Roohani Dhaal AdMob App ID
- `ADMOB_BANNER_ID`: اسی ایپ کا Banner Ad Unit ID
- `VERSION_CODE`: پہلی ریلیز کے لیے 1؛ ہر نئی اپڈیٹ پر پچھلے استعمال شدہ نمبر سے بڑا

ابتدائی جانچ کے لیے workflow Google کے test IDs استعمال کرتا ہے، اگر اصل IDs موجود نہ ہوں۔ Test IDs والی AAB کو Play Store پر production یا public testing کے لیے جمع نہ کریں۔ اصل AdMob IDs شامل کرکے دوبارہ build کریں۔

## لازمی GitHub Secrets برائے signed AAB
- `KEYSTORE_BASE64`
- `KEYSTORE_PASSWORD`
- `KEY_ALIAS`
- `KEY_PASSWORD`

اگر یہ Secrets موجود نہ ہوں تو Workflow صرف debug APK اور unsigned AAB بنا سکتا ہے۔ Unsigned AAB Google Play پر اپلوڈ نہیں ہو سکتی۔ اگر ایپ پہلے سے Play پر ہے تو اسی ایپ کی اصل upload keystore استعمال کریں؛ نئی key بنانے سے اپڈیٹ کی signing مطابقت ٹوٹ سکتی ہے۔

## پالیسی
اس وقت نئی Android ایپ اور اپڈیٹس کے لیے Target API 36 درکار ہے۔ فروری 2027 کے Android quality thresholds میں memory، bitmap memory اور DEX optimization شامل ہیں؛ Google نے ان thresholds کی تفصیلات الگ سے شائع کرنے کا کہا ہے۔ اس لیے R8 فعال کرنا مفید تیاری ہے، مگر اس سے 2027 compliance کی ضمانت نہیں ملتی۔

## اشاعت سے پہلے لازمی انسانی کام
- `public/privacy.html` میں ناشر کا فعال رابطہ ای میل شامل کریں اور اسے عوامی HTTPS URL پر شائع کریں؛ Play Console کے Privacy Policy اور Data safety فارم بھی اسی حقیقی ڈیٹا پراسیسنگ کے مطابق مکمل کریں۔
- AdMob IDs اسی Roohani Dhaal ایپ کے ہونے چاہییں؛ کسی دوسری ایپ کے App ID یا Ad Unit ID کو نقل نہ کریں۔
- Google Play پر اگر یہ ایپ پہلے سے موجود ہو تو `VERSION_CODE` کو Play Console میں آخری استعمال شدہ versionCode سے بڑا رکھیں۔
- دینی مواد کی اشاعت سے پہلے 56 زیرِ تحقیق اندراجات کی تخریج/متن/ترجمہ کی علمی جانچ مکمل کریں۔
