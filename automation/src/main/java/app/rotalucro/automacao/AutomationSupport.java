package app.rotalucro.automacao;

import android.accessibilityservice.AccessibilityService;
import android.content.ComponentName;
import android.content.Context;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.graphics.PixelFormat;
import android.graphics.Typeface;
import android.provider.Settings;
import android.text.TextUtils;
import android.view.Gravity;
import android.view.View;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;

import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

final class AccessibilityUtils {
    private AccessibilityUtils() {}

    static boolean isServiceEnabled(Context context, Class<? extends AccessibilityService> service) {
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

final class OverlayController {
    private final AccessibilityService service;
    private final WindowManager wm;
    private View overlay;
    private String lastSignature = "";
    private long lastShownAt = 0;
    private final NumberFormat brl = NumberFormat.getCurrencyInstance(new Locale("pt", "BR"));

    OverlayController(AccessibilityService service) {
        this.service = service;
        this.wm = (WindowManager) service.getSystemService(AccessibilityService.WINDOW_SERVICE);
    }

    void show(RideOffer offer, RideAnalyzer.Result result) {
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
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE |
                WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL |
                WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN,
            PixelFormat.TRANSLUCENT
        );
        lp.gravity = Gravity.TOP | Gravity.CENTER_HORIZONTAL;
        lp.y = dp(22);
        overlay = card;
        wm.addView(card, lp);
    }

    void hide() {
        if (overlay != null) {
            try { wm.removeView(overlay); } catch (Exception ignored) {}
            overlay = null;
        }
    }

    private TextView text(String value, int sp, int color, boolean bold) {
        TextView t = new TextView(service);
        t.setText(value);
        t.setTextColor(color);
        t.setTextSize(sp);
        if (bold) t.setTypeface(Typeface.DEFAULT_BOLD);
        return t;
    }

    private int dp(int v) {
        return Math.round(v * service.getResources().getDisplayMetrics().density);
    }
}

final class RideAnalyzer {
    static class Result {
        String recommendation;
        String status;
        double grossKm, grossHour, cost, net, netKm;
        int score;
    }

    private RideAnalyzer() {}

    static Result analyze(Context context, RideOffer offer) {
        SharedPreferences p = context.getSharedPreferences("rota_lucro_native", Context.MODE_PRIVATE);
        double fuelPrice = p.getFloat("fuel_price", 6.10f);
        double kmPerLiter = Math.max(.1, p.getFloat("km_per_liter", 10.5f));
        double maintenance = p.getFloat("maintenance_km", .35f);
        double other = p.getFloat("other_km", .10f);
        double minNetKm = Math.max(.01, p.getFloat("min_net_km", 1.35f));
        double minGrossHour = Math.max(.01, p.getFloat("min_gross_hour", 35f));

        double km = offer.totalKm();
        double totalCostKm = fuelPrice / kmPerLiter + maintenance + other;
        Result r = new Result();
        r.grossKm = offer.fare / km;
        r.grossHour = offer.fare / (offer.minutes / 60.0);
        r.cost = km * totalCostKm;
        r.net = offer.fare - r.cost;
        r.netKm = r.net / km;

        double kmRatio = r.netKm / minNetKm;
        double hourRatio = r.grossHour / minGrossHour;
        if (kmRatio >= 1 && hourRatio >= 1) {
            r.recommendation = "ACEITAR";
            r.status = "good";
        } else if ((kmRatio < .85 && hourRatio < .85) ||
                   (kmRatio >= 1 && hourRatio < .75) ||
                   (hourRatio >= 1 && kmRatio < .75)) {
            r.recommendation = "RECUSAR";
            r.status = "bad";
        } else {
            r.recommendation = "AVALIAR";
            r.status = "warn";
        }
        r.score = (int)Math.max(0, Math.min(100,
            Math.round((((Math.min(kmRatio, 1.4) + Math.min(hourRatio, 1.4)) / 2.0) / 1.4) * 100)));
        return r;
    }
}

final class RideOffer {
    final String platform;
    final double fare;
    final double pickupKm;
    final double tripKm;
    final int minutes;

    RideOffer(String platform, double fare, double pickupKm, double tripKm, int minutes) {
        this.platform = platform;
        this.fare = fare;
        this.pickupKm = pickupKm;
        this.tripKm = tripKm;
        this.minutes = minutes;
    }

    double totalKm() {
        return pickupKm + tripKm;
    }
}

final class RideOfferParser {
    private static final Pattern MONEY = Pattern.compile("R\\$\\s*([0-9]{1,4}(?:\\.[0-9]{3})*(?:,[0-9]{1,2})?)");
    private static final Pattern KM = Pattern.compile("([0-9]{1,3}(?:[\\.,][0-9]{1,2})?)\\s*km\\b", Pattern.CASE_INSENSITIVE);
    private static final Pattern MIN = Pattern.compile("([0-9]{1,3})\\s*(?:min|minutos?)\\b", Pattern.CASE_INSENSITIVE);

    private RideOfferParser() {}

    static RideOffer parse(String platform, List<String> visibleTexts) {
        if (visibleTexts == null || visibleTexts.isEmpty()) return null;
        String joined = String.join(" • ", visibleTexts);
        List<Double> money = doubles(MONEY, joined);
        List<Double> kms = doubles(KM, joined);
        List<Integer> mins = ints(MIN, joined);
        if (money.isEmpty() || kms.isEmpty() || mins.isEmpty()) return null;

        double fare = 0;
        for (double v : money) {
            if (v >= 3 && v <= 500) {
                fare = v;
                break;
            }
        }
        if (fare <= 0) return null;

        List<Double> plausible = new ArrayList<>();
        for (double k : kms) if (k > 0 && k < 300) plausible.add(k);
        if (plausible.isEmpty()) return null;
        double pickup = plausible.size() >= 2 ? plausible.get(0) : 0;
        double trip = plausible.size() >= 2 ? plausible.get(1) : plausible.get(0);

        int minutes = 0;
        for (int m : mins) {
            if (m > 0 && m < 300) {
                minutes = m;
                break;
            }
        }
        if (minutes <= 0 || pickup + trip <= 0) return null;
        if (fare / (pickup + trip) > 50) return null;
        return new RideOffer(platform, fare, pickup, trip, minutes);
    }

    private static List<Double> doubles(Pattern p, String text) {
        List<Double> out = new ArrayList<>();
        Matcher m = p.matcher(text);
        while (m.find()) {
            try {
                out.add(Double.parseDouble(m.group(1).replace(".", "").replace(",", ".")));
            } catch (Exception ignored) {}
        }
        return out;
    }

    private static List<Integer> ints(Pattern p, String text) {
        List<Integer> out = new ArrayList<>();
        Matcher m = p.matcher(text);
        while (m.find()) {
            try { out.add(Integer.parseInt(m.group(1))); }
            catch (Exception ignored) {}
        }
        return out;
    }
}
