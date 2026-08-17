package app.rotalucro.motorista;

import android.content.Context;
import android.content.SharedPreferences;

public final class RideAnalyzer {
    public static class Result {
        public String recommendation;
        public String status;
        public double grossKm, grossHour, cost, net, netKm;
        public int score;
    }

    private RideAnalyzer() {}

    public static Result analyze(Context context, RideOffer offer) {
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
        } else if ((kmRatio < .85 && hourRatio < .85) || (kmRatio >= 1 && hourRatio < .75) || (hourRatio >= 1 && kmRatio < .75)) {
            r.recommendation = "RECUSAR";
            r.status = "bad";
        } else {
            r.recommendation = "AVALIAR";
            r.status = "warn";
        }
        r.score = (int)Math.max(0, Math.min(100, Math.round((((Math.min(kmRatio, 1.4) + Math.min(hourRatio, 1.4)) / 2.0) / 1.4) * 100)));
        return r;
    }
}
