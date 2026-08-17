package app.rotalucro.motorista;

public class RideOffer {
    public final String platform;
    public final double fare;
    public final double pickupKm;
    public final double tripKm;
    public final int minutes;

    public RideOffer(String platform, double fare, double pickupKm, double tripKm, int minutes) {
        this.platform = platform;
        this.fare = fare;
        this.pickupKm = pickupKm;
        this.tripKm = tripKm;
        this.minutes = minutes;
    }

    public double totalKm() { return pickupKm + tripKm; }
}
