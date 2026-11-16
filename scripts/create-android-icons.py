from pathlib import Path
from PIL import Image
import xml.etree.ElementTree as ET

src = Image.open('public/icon.png').convert('RGBA')
base = Path('android/app/src/main/res')
sizes = {'mdpi':48,'hdpi':72,'xhdpi':96,'xxhdpi':144,'xxxhdpi':192}
for density, size in sizes.items():
    folder = base / f'mipmap-{density}'
    folder.mkdir(parents=True, exist_ok=True)
    icon = src.resize((size,size), Image.Resampling.LANCZOS)
    icon.save(folder/'ic_launcher.png', optimize=True)
    icon.save(folder/'ic_launcher_round.png', optimize=True)
    icon.save(folder/'ic_launcher_foreground.png', optimize=True)

folder = base/'mipmap-anydpi-v26'
folder.mkdir(parents=True, exist_ok=True)
(folder/'ic_launcher.xml').write_text('''<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
</adaptive-icon>''')
(folder/'ic_launcher_round.xml').write_text('''<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
</adaptive-icon>''')
values = base/'values'
values.mkdir(parents=True, exist_ok=True)
(values/'ic_launcher_background.xml').write_text('''<?xml version="1.0" encoding="utf-8"?>
<resources><color name="ic_launcher_background">#123D32</color></resources>''')
