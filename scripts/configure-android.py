from pathlib import Path
import os, re

android = Path("android")
variables = android / "variables.gradle"
if not variables.exists():
    raise SystemExit("android/variables.gradle not found")

text = variables.read_text()
for key, value in (("minSdkVersion", 24), ("compileSdkVersion", 36), ("targetSdkVersion", 36)):
    pattern = "(?m)^([ \\t]*" + re.escape(key) + "[ \\t]*=[ \\t]*)[0-9]+"
    text, count = re.subn(pattern, lambda match: match.group(1) + str(value), text)
    if count != 1:
        raise SystemExit(f"Expected exactly one {key}; found {count}")
variables.write_text(text)

app_gradle = android / "app/build.gradle"
gradle = app_gradle.read_text()
gradle, count = re.subn(r'applicationId[ \\t]+"[^"]+"', 'applicationId "com.albazi.roohanidhaal"', gradle, count=1)
if count != 1:
    raise SystemExit("Could not set applicationId")

version_code = int(os.environ.get("VERSION_CODE", "1"))
if version_code < 1:
    raise SystemExit("VERSION_CODE must be at least 1")
gradle, count = re.subn(r"versionCode[ \\t]+[0-9]+", f"versionCode {version_code}", gradle, count=1)
if count != 1:
    raise SystemExit("Could not set versionCode")
gradle, count = re.subn(r'versionName[ \\t]+"[^"]+"', 'versionName "1.0.0"', gradle, count=1)
if count != 1:
    raise SystemExit("Could not set versionName")

if re.search(r"minifyEnabled[ \\t]+false", gradle):
    gradle = re.sub(r"minifyEnabled[ \\t]+false", "minifyEnabled true", gradle, count=1)
elif not re.search(r"minifyEnabled[ \\t]+true", gradle):
    raise SystemExit("Release minifyEnabled setting not found")
if re.search(r"shrinkResources[ \\t]+false", gradle):
    gradle = re.sub(r"shrinkResources[ \\t]+false", "shrinkResources true", gradle, count=1)
elif not re.search(r"shrinkResources[ \\t]+true", gradle):
    gradle = gradle.replace("minifyEnabled true", "minifyEnabled true" + chr(10) + "            shrinkResources true", 1)
gradle = gradle.replace("proguard-android.txt", "proguard-android-optimize.txt")
app_gradle.write_text(gradle)

strings_file = android / "app/src/main/res/values/strings.xml"
strings = strings_file.read_text()
if re.search(r'<string name="app_name">.*?</string>', strings, re.S):
    strings = re.sub(r'<string name="app_name">.*?</string>', '<string name="app_name">روحانی ڈھال</string>', strings, flags=re.S)
else:
    strings = strings.replace("</resources>", '<string name="app_name">روحانی ڈھال</string></resources>')
strings_file.write_text(strings)

app_id = os.environ.get("ADMOB_APP_ID", "").strip()
if not app_id:
    raise SystemExit("ADMOB_APP_ID is required")
manifest_file = android / "app/src/main/AndroidManifest.xml"
manifest = manifest_file.read_text()
permission = '    <uses-permission android:name="com.google.android.gms.permission.AD_ID" />'
if "com.google.android.gms.permission.AD_ID" not in manifest:
    manifest = manifest.replace("<application", permission + chr(10) + "    <application", 1)
metadata = '        <meta-data android:name="com.google.android.gms.ads.APPLICATION_ID" android:value="@string/admob_app_id" />'
if "com.google.android.gms.ads.APPLICATION_ID" not in manifest:
    manifest = manifest.replace("</application>", metadata + chr(10) + "    </application>")
manifest_file.write_text(manifest)

values_dir = android / "app/src/main/res/values"
values_dir.mkdir(parents=True, exist_ok=True)
(values_dir / "admob_strings.xml").write_text(
    '<?xml version="1.0" encoding="utf-8"?>' + chr(10) +
    '<resources><string name="admob_app_id">' + app_id + '</string></resources>'
)

print(f"Configured appId=com.albazi.roohanidhaal, versionCode={version_code}, minSdk=24, compileSdk=36, targetSdk=36, AdMob and R8.")
