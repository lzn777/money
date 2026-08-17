package app.rotalucro.motorista;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public final class RideOfferParser {
    private static final Pattern MONEY = Pattern.compile("R\\$\\s*([0-9]{1,4}(?:\\.[0-9]{3})*(?:,[0-9]{1,2})?)");
    private static final Pattern KM = Pattern.compile("([0-9]{1,3}(?:[\\.,][0-9]{1,2})?)\\s*km\\b", Pattern.CASE_INSENSITIVE);
    private static final Pattern MIN = Pattern.compile("([0-9]{1,3})\\s*(?:min|minutos?)\\b", Pattern.CASE_INSENSITIVE);

    private RideOfferParser() {}

    public static RideOffer parse(String platform, List<String> visibleTexts) {
        if (visibleTexts == null || visibleTexts.isEmpty()) return null;
        String joined = String.join(" • ", visibleTexts);
        List<Double> money = doubles(MONEY, joined);
        List<Double> kms = doubles(KM, joined);
        List<Integer> mins = ints(MIN, joined);
        if (money.isEmpty() || kms.isEmpty() || mins.isEmpty()) return null;

        double fare = 0;
        for (double v : money) if (v >= 3 && v <= 500) { fare = v; break; }
        if (fare <= 0) return null;

        List<Double> plausible = new ArrayList<>();
        for (double k : kms) if (k > 0 && k < 300) plausible.add(k);
        if (plausible.isEmpty()) return null;
        double pickup = plausible.size() >= 2 ? plausible.get(0) : 0;
        double trip = plausible.size() >= 2 ? plausible.get(1) : plausible.get(0);

        int minutes = 0;
        for (int m : mins) if (m > 0 && m < 300) { minutes = m; break; }
        if (minutes <= 0 || pickup + trip <= 0) return null;
        if (fare / (pickup + trip) > 50) return null;
        return new RideOffer(platform, fare, pickup, trip, minutes);
    }

    private static List<Double> doubles(Pattern p, String text) {
        List<Double> out = new ArrayList<>();
        Matcher m = p.matcher(text);
        while (m.find()) {
            try { out.add(Double.parseDouble(m.group(1).replace(".", "").replace(",", "."))); } catch (Exception ignored) {}
        }
        return out;
    }

    private static List<Integer> ints(Pattern p, String text) {
        List<Integer> out = new ArrayList<>();
        Matcher m = p.matcher(text);
        while (m.find()) {
            try { out.add(Integer.parseInt(m.group(1))); } catch (Exception ignored) {}
        }
        return out;
    }
}
