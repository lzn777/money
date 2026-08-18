package app.rotalucro.automacao;

import android.accessibilityservice.AccessibilityService;
import android.content.SharedPreferences;
import android.view.accessibility.AccessibilityEvent;
import android.view.accessibility.AccessibilityNodeInfo;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class RideAccessibilityService extends AccessibilityService {
    private OverlayController overlay;
    private long lastParseAt = 0;
    private static final Set<String> SUPPORTED = new HashSet<>();

    static {
        SUPPORTED.add("com.ubercab.driver");
        SUPPORTED.add("com.app99.driver");
    }

    @Override protected void onServiceConnected() {
        super.onServiceConnected();
        overlay = new OverlayController(this);
    }

    @Override public void onAccessibilityEvent(AccessibilityEvent event) {
        if (event == null || event.getPackageName() == null) return;
        String pkg = event.getPackageName().toString();
        if (!SUPPORTED.contains(pkg)) {
            if (overlay != null) overlay.hide();
            return;
        }

        SharedPreferences prefs = getSharedPreferences("rota_lucro_native", MODE_PRIVATE);
        if (!prefs.getBoolean("accessibility_disclosure_consent", false)) return;

        long now = System.currentTimeMillis();
        if (now - lastParseAt < 350) return;
        lastParseAt = now;

        AccessibilityNodeInfo root = getRootInActiveWindow();
        if (root == null) return;
        List<String> texts = new ArrayList<>();
        collectTexts(root, texts, 0);
        if (texts.isEmpty()) return;

        String platform = pkg.equals("com.ubercab.driver") ? "Uber" : "99";
        RideOffer offer = RideOfferParser.parse(platform, texts);
        if (offer == null) return;
        RideAnalyzer.Result result = RideAnalyzer.analyze(this, offer);
        if (overlay == null) overlay = new OverlayController(this);
        overlay.show(offer, result);
    }

    private void collectTexts(AccessibilityNodeInfo node, List<String> out, int depth) {
        if (node == null || depth > 25 || out.size() > 250) return;
        CharSequence text = node.getText();
        if (text != null) {
            String s = text.toString().trim();
            if (!s.isEmpty() && s.length() <= 180) out.add(s);
        }
        CharSequence desc = node.getContentDescription();
        if (desc != null) {
            String s = desc.toString().trim();
            if (!s.isEmpty() && s.length() <= 180 && !out.contains(s)) out.add(s);
        }
        for (int i = 0; i < node.getChildCount(); i++) {
            AccessibilityNodeInfo child = node.getChild(i);
            if (child != null) collectTexts(child, out, depth + 1);
        }
    }

    @Override public void onInterrupt() {
        if (overlay != null) overlay.hide();
    }

    @Override public void onDestroy() {
        if (overlay != null) overlay.hide();
        super.onDestroy();
    }
}
