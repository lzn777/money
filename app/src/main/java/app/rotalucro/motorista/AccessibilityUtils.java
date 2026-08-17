package app.rotalucro.motorista;

import android.accessibilityservice.AccessibilityService;
import android.content.ComponentName;
import android.content.Context;
import android.provider.Settings;
import android.text.TextUtils;

public final class AccessibilityUtils {
    private AccessibilityUtils() {}

    public static boolean isServiceEnabled(Context context, Class<? extends AccessibilityService> service) {
        String enabled = Settings.Secure.getString(
            context.getContentResolver(),
            Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES
        );
        if (enabled == null) return false;
        ComponentName expected = new ComponentName(context, service);
        TextUtils.SimpleStringSplitter splitter = new TextUtils.SimpleStringSplitter(':');
        splitter.setString(enabled);
        while (splitter.hasNext()) {
            ComponentName actual = ComponentName.unflattenFromString(splitter.next());
            if (expected.equals(actual)) return true;
        }
        return false;
    }
}
