package app.rotalucro.motorista;

import android.app.Activity;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.os.Bundle;
import android.provider.Settings;
import android.text.InputType;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;

import com.google.androidbrowserhelper.trusted.LauncherActivity;

public class MainActivity extends Activity {
    private SharedPreferences prefs;
    private TextView statusView;

    @Override protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        prefs = getSharedPreferences("rota_lucro_native", MODE_PRIVATE);
        showHome();
    }

    @Override protected void onResume() {
        super.onResume();
        refreshStatus();
    }

    private LinearLayout base() {
        LinearLayout box = new LinearLayout(this);
        box.setOrientation(LinearLayout.VERTICAL);
        box.setPadding(dp(22), dp(28), dp(22), dp(28));
        box.setBackgroundColor(0xFF030A0F);
        return box;
    }

    private void setScrollable(LinearLayout box) {
        ScrollView s = new ScrollView(this);
        s.setFillViewport(true);
        s.addView(box);
        setContentView(s);
    }

    private void showHome() {
        LinearLayout box = base();
        TextView logo = text("ROTA LUCRO", 28, 0xFFA8FF38, true);
        box.addView(logo);
        TextView sub = text("Análise automática de corridas", 16, Color.WHITE, true);
        sub.setPadding(0, dp(6), 0, dp(18));
        box.addView(sub);

        statusView = text("", 14, Color.LTGRAY, true);
        statusView.setPadding(dp(14), dp(12), dp(14), dp(12));
        box.addView(statusView);
        refreshStatus();

        Button open = button("Abrir Rota Lucro", 0xFF58D215);
        open.setOnClickListener(v -> startActivity(new Intent(this, LauncherActivity.class)));
        box.addView(open);

        Button auto = button("Ativar análise automática", 0xFF163846);
        auto.setOnClickListener(v -> showDisclosure());
        box.addView(auto);

        Button cfg = button("Configurar critérios automáticos", 0xFF0D2937);
        cfg.setOnClickListener(v -> showSettings());
        box.addView(cfg);

        TextView note = text("O Rota Lucro lê apenas o texto visível das ofertas de corrida após sua autorização. Ele não aceita nem recusa corridas automaticamente.", 12, 0xFF8FA6B0, false);
        note.setPadding(0, dp(18), 0, 0);
        box.addView(note);
        setScrollable(box);
    }

    private void refreshStatus() {
        if (statusView == null) return;
        boolean enabled = AccessibilityUtils.isServiceEnabled(this, RideAccessibilityService.class);
        statusView.setText(enabled ? "● Análise automática ATIVA" : "○ Análise automática DESATIVADA");
        statusView.setTextColor(enabled ? 0xFF9CFF71 : 0xFFFFC15A);
        statusView.setBackgroundColor(enabled ? 0xFF0D2A22 : 0xFF21190B);
    }

    private void showDisclosure() {
        LinearLayout box = base();
        box.addView(text("Antes de ativar", 25, Color.WHITE, true));
        TextView disclosure = text(
            "Uso do Serviço de Acessibilidade\n\n" +
            "Para analisar uma oferta enquanto ela aparece na Uber Driver ou na 99 Motorista, o Rota Lucro precisa ler o texto visível dessas telas.\n\n" +
            "Dados acessados: valor da oferta, distância, tempo e textos relacionados à corrida visíveis na tela.\n\n" +
            "Uso: os dados são processados no aparelho para calcular R$/km, R$/hora, custo e lucro estimado e mostrar uma sugestão ACEITAR, AVALIAR ou RECUSAR.\n\n" +
            "O Rota Lucro não toca nos botões da Uber/99, não aceita nem recusa corridas automaticamente e, nesta versão, não envia o conteúdo lido para um servidor.",
            14, 0xFFD9E6EB, false);
        disclosure.setPadding(0, dp(16), 0, dp(18));
        box.addView(disclosure);

        CheckBox agree = new CheckBox(this);
        agree.setText("Li e concordo com o uso descrito acima.");
        agree.setTextColor(Color.WHITE);
        agree.setTextSize(14);
        box.addView(agree);

        Button consent = button("Concordar e abrir configurações", 0xFF58D215);
        consent.setEnabled(false);
        consent.setAlpha(.45f);
        agree.setOnCheckedChangeListener((b, checked) -> { consent.setEnabled(checked); consent.setAlpha(checked ? 1f : .45f); });
        consent.setOnClickListener(v -> {
            prefs.edit().putBoolean("accessibility_disclosure_consent", true).apply();
            startActivity(new Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS));
        });
        box.addView(consent);

        Button back = button("Voltar", 0xFF163846);
        back.setOnClickListener(v -> showHome());
        box.addView(back);
        setScrollable(box);
    }

    private void showSettings() {
        LinearLayout box = base();
        box.addView(text("Critérios da análise automática", 23, Color.WHITE, true));
        EditText fuel = numeric("Preço combustível (R$/L)", prefs.getFloat("fuel_price", 6.10f));
        EditText kmpl = numeric("Consumo (km/L)", prefs.getFloat("km_per_liter", 10.5f));
        EditText maint = numeric("Manutenção por km", prefs.getFloat("maintenance_km", .35f));
        EditText other = numeric("Outros custos por km", prefs.getFloat("other_km", .10f));
        EditText minKm = numeric("Mínimo líquido por km", prefs.getFloat("min_net_km", 1.35f));
        EditText minHour = numeric("Mínimo bruto por hora", prefs.getFloat("min_gross_hour", 35f));
        box.addView(fuel); box.addView(kmpl); box.addView(maint); box.addView(other); box.addView(minKm); box.addView(minHour);
        Button save = button("Salvar critérios", 0xFF58D215);
        save.setOnClickListener(v -> {
            prefs.edit()
                .putFloat("fuel_price", parse(fuel, 6.10f))
                .putFloat("km_per_liter", Math.max(.1f, parse(kmpl, 10.5f)))
                .putFloat("maintenance_km", parse(maint, .35f))
                .putFloat("other_km", parse(other, .10f))
                .putFloat("min_net_km", Math.max(.01f, parse(minKm, 1.35f)))
                .putFloat("min_gross_hour", Math.max(.01f, parse(minHour, 35f)))
                .apply();
            showHome();
        });
        box.addView(save);
        Button back = button("Voltar sem salvar", 0xFF163846);
        back.setOnClickListener(v -> showHome());
        box.addView(back);
        setScrollable(box);
    }

    private EditText numeric(String hint, float value) {
        EditText e = new EditText(this);
        e.setHint(hint); e.setHintTextColor(0xFF7895A2); e.setTextColor(Color.WHITE);
        e.setText(String.valueOf(value)); e.setTextSize(16); e.setSingleLine(true);
        e.setInputType(InputType.TYPE_CLASS_NUMBER | InputType.TYPE_NUMBER_FLAG_DECIMAL);
        e.setPadding(dp(14), dp(13), dp(14), dp(13)); e.setBackgroundColor(0xFF071A24);
        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        lp.setMargins(0, dp(9), 0, 0); e.setLayoutParams(lp); return e;
    }

    private float parse(EditText e, float fallback) {
        try { return Float.parseFloat(e.getText().toString().trim().replace(',', '.')); }
        catch (Exception ex) { return fallback; }
    }

    private TextView text(String value, int sp, int color, boolean bold) {
        TextView t = new TextView(this); t.setText(value); t.setTextColor(color); t.setTextSize(sp);
        if (bold) t.setTypeface(android.graphics.Typeface.DEFAULT_BOLD); return t;
    }

    private Button button(String label, int bg) {
        Button b = new Button(this); b.setText(label); b.setTextColor(Color.WHITE); b.setTextSize(14); b.setAllCaps(false); b.setBackgroundColor(bg);
        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(52)); lp.setMargins(0, dp(12), 0, 0); b.setLayoutParams(lp); return b;
    }

    private int dp(int v) { return Math.round(v * getResources().getDisplayMetrics().density); }
}
