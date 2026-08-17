package app.rotalucro.motorista;

import android.accessibilityservice.AccessibilityService;
import android.graphics.Color;
import android.graphics.PixelFormat;
import android.graphics.Typeface;
import android.view.Gravity;
import android.view.View;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;

import java.text.NumberFormat;
import java.util.Locale;

public class OverlayController {
    private final AccessibilityService service;
    private final WindowManager wm;
    private View overlay;
    private String lastSignature = "";
    private long lastShownAt = 0;
    private final NumberFormat brl = NumberFormat.getCurrencyInstance(new Locale("pt", "BR"));

    public OverlayController(AccessibilityService service) {
        this.service = service;
        this.wm = (WindowManager) service.getSystemService(AccessibilityService.WINDOW_SERVICE);
    }

    public void show(RideOffer offer, RideAnalyzer.Result result) {
        String sig = offer.platform + "|" + offer.fare + "|" + offer.totalKm() + "|" + offer.minutes;
        long now = System.currentTimeMillis();
        if (sig.equals(lastSignature) && now - lastShownAt < 5000) return;
        lastSignature = sig;
        lastShownAt = now;
        hide();

        int bg = "good".equals(result.status) ? 0xEE0B2B19 : "bad".equals(result.status) ? 0xEE321018 : 0xEE34280B;
        int accent = "good".equals(result.status) ? 0xFF8CFF55 : "bad".equals(result.status) ? 0xFFFF6F7D : 0xFFFFCD5C;

        LinearLayout card = new LinearLayout(service);
        card.setOrientation(LinearLayout.VERTICAL);
        card.setPadding(dp(16), dp(12), dp(16), dp(12));
        card.setBackgroundColor(bg);
        card.addView(text("ROTA LUCRO • " + offer.platform, 11, 0xFFB7C8CF, true));
        TextView rec = text("Sugestão: " + result.recommendation + "  •  " + result.score + "/100", 23, accent, true);
        rec.setPadding(0, dp(3), 0, dp(5));
        card.addView(rec);
        card.addView(text(brl.format(offer.fare) + "  •  " + brl.format(result.netKm) + "/km líquido  •  " + brl.format(result.grossHour) + "/h", 13, Color.WHITE, true));
        TextView meta = text(String.format(new Locale("pt", "BR"), "Distância %.1f km • %d min • lucro est. %s", offer.totalKm(), offer.minutes, brl.format(result.net)), 11, 0xFFA8BBC3, false);
        meta.setPadding(0, dp(4), 0, dp(8));
        card.addView(meta);
        Button close = new Button(service);
        close.setText("Fechar análise");
        close.setAllCaps(false);
        close.setTextColor(Color.WHITE);
        close.setBackgroundColor(0xFF163846);
        close.setOnClickListener(v -> hide());
        card.addView(close);

        WindowManager.LayoutParams lp = new WindowManager.LayoutParams(
            WindowManager.LayoutParams.MATCH_PARENT,
            WindowManager.LayoutParams.WRAP_CONTENT,
            WindowManager.LayoutParams.TYPE_ACCESSIBILITY_OVERLAY,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE | WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL | WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN,
            PixelFormat.TRANSLUCENT
        );
        lp.gravity = Gravity.TOP | Gravity.CENTER_HORIZONTAL;
        lp.y = dp(22);
        overlay = card;
        wm.addView(card, lp);
    }

    public void hide() {
        if (overlay != null) {
            try { wm.removeView(overlay); } catch (Exception ignored) {}
            overlay = null;
        }
    }

    private TextView text(String value, int sp, int color, boolean bold) {
        TextView t = new TextView(service);
        t.setText(value); t.setTextColor(color); t.setTextSize(sp);
        if (bold) t.setTypeface(Typeface.DEFAULT_BOLD);
        return t;
    }

    private int dp(int v) { return Math.round(v * service.getResources().getDisplayMetrics().density); }
}
