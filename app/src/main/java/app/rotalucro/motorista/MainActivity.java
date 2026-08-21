package app.rotalucro.motorista;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.Gravity;
import android.view.View;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

public class MainActivity extends Activity {
    private static final String HOME_URL = "https://rota-lucro-pwa-v61-botao-confirmar.vercel.app/";
    private static final String PRIVACY_URL = "https://raw.githubusercontent.com/lzn777/money/main/PRIVACY_POLICY.md";
    private static final int PICK = 1101;

    private WebView web;
    private ProgressBar progress;
    private LinearLayout error;
    private ValueCallback<Uri[]> chooser;

    @SuppressLint("SetJavaScriptEnabled")
    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        getWindow().setStatusBarColor(Color.rgb(3,10,15));
        getWindow().setNavigationBarColor(Color.rgb(3,10,15));

        FrameLayout root=new FrameLayout(this);root.setBackgroundColor(Color.rgb(3,10,15));
        web=new WebView(this);web.setBackgroundColor(Color.rgb(3,10,15));web.setAlpha(0f);root.addView(web,new FrameLayout.LayoutParams(-1,-1));
        progress=new ProgressBar(this,null,android.R.attr.progressBarStyleHorizontal);progress.setMax(100);FrameLayout.LayoutParams pp=new FrameLayout.LayoutParams(-1,dp(3));pp.gravity=Gravity.TOP;root.addView(progress,pp);
        error=errorView();error.setVisibility(View.GONE);root.addView(error,new FrameLayout.LayoutParams(-1,-1));setContentView(root);

        WebSettings s=web.getSettings();s.setJavaScriptEnabled(true);s.setDomStorageEnabled(true);s.setDatabaseEnabled(true);s.setCacheMode(WebSettings.LOAD_DEFAULT);s.setLoadWithOverviewMode(true);s.setUseWideViewPort(true);s.setSupportZoom(false);s.setBuiltInZoomControls(false);s.setDisplayZoomControls(false);s.setAllowFileAccess(false);s.setAllowContentAccess(true);s.setMediaPlaybackRequiresUserGesture(false);s.setTextZoom(100);s.setSupportMultipleWindows(false);s.setGeolocationEnabled(false);s.setSaveFormData(false);s.setUserAgentString(s.getUserAgentString()+" RotaLucroAndroid/1.7.0");
        if(Build.VERSION.SDK_INT>=Build.VERSION_CODES.LOLLIPOP)s.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        if(Build.VERSION.SDK_INT>=Build.VERSION_CODES.O)s.setSafeBrowsingEnabled(true);
        WebView.setWebContentsDebuggingEnabled(false);

        web.setWebViewClient(new WebViewClient(){
            @Override public boolean shouldOverrideUrlLoading(WebView v,WebResourceRequest r){return nav(r.getUrl());}
            @Override public boolean shouldOverrideUrlLoading(WebView v,String u){return nav(Uri.parse(u));}
            @Override public void onPageStarted(WebView v,String u,android.graphics.Bitmap f){progress.setVisibility(View.VISIBLE);if(u!=null&&u.startsWith(HOME_URL))v.setAlpha(0f);}
            @Override public void onPageFinished(WebView v,String u){
                progress.setVisibility(View.GONE);error.setVisibility(View.GONE);
                if(u!=null&&u.startsWith(HOME_URL)){
                    String removeAnalyzer=asset("remove_analyzer.js"),enhancements=asset("enhancements.js"),cpmaUi=asset("cpma_ui.js"),configHub=asset("cpma_settings.js");
                    StringBuilder script=new StringBuilder();
                    if(removeAnalyzer!=null&&!removeAnalyzer.isEmpty())script.append(removeAnalyzer).append(';');
                    if(enhancements!=null&&!enhancements.isEmpty())script.append(enhancements).append(';');
                    if(cpmaUi!=null&&!cpmaUi.isEmpty())script.append(cpmaUi).append(';');
                    if(configHub!=null&&!configHub.isEmpty())script.append(configHub).append(';');
                    script.append(privacyCardScript());
                    script.append(";document.querySelectorAll('button,a,[role=\"button\"]').forEach(function(b){var t=(b.textContent||'').toUpperCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g,'');if(t.indexOf('ANALISAR CORRIDA')>=0||t.indexOf('ANALIZAR CORRIDA')>=0)b.remove();});var tr=document.getElementById('trip');if(tr)tr.remove();var nb=document.querySelector('.nav button[data-s=\"trip\"]');if(nb)nb.remove();var n=document.querySelector('.nav');if(n)n.style.gridTemplateColumns='repeat(4,1fr)';");
                    v.evaluateJavascript(script.toString(),value->v.animate().alpha(1f).setDuration(90).start());
                }else v.setAlpha(1f);
            }
            @Override public void onReceivedError(WebView v,WebResourceRequest r,WebResourceError e){if(Build.VERSION.SDK_INT>=23&&r.isForMainFrame())showError();}
            @SuppressWarnings("deprecation") @Override public void onReceivedError(WebView v,int c,String d,String u){if(Build.VERSION.SDK_INT<23)showError();}
        });
        web.setWebChromeClient(new WebChromeClient(){
            @Override public void onProgressChanged(WebView v,int p){progress.setProgress(p);progress.setVisibility(p>=100?View.GONE:View.VISIBLE);}
            @Override public boolean onShowFileChooser(WebView w,ValueCallback<Uri[]> cb,FileChooserParams p){if(chooser!=null)chooser.onReceiveValue(null);chooser=cb;try{startActivityForResult(p.createIntent(),PICK);return true;}catch(ActivityNotFoundException e){chooser.onReceiveValue(null);chooser=null;return false;}}
        });
        if(state!=null)web.restoreState(state);else web.loadUrl(HOME_URL);
    }

    private String privacyCardScript(){return "(function(){var s=document.getElementById('settings');if(!s||document.getElementById('privacyPlayCard'))return;var c=document.createElement('div');c.id='privacyPlayCard';c.className='card';c.innerHTML='<div class=\"ey\">PRIVACIDADE E SEGURANÇA</div><strong style=\"display:block;margin:7px 0\">Seus registros financeiros ficam no seu aparelho</strong><div class=\"muted\" style=\"margin-bottom:10px\">O Rota Lucro não exige conta e não usa localização, contatos, SMS ou Acessibilidade.</div><a href=\""+PRIVACY_URL+"\" style=\"display:block;text-align:center;text-decoration:none\" class=\"btn secondary full\">Política de Privacidade</a>';s.appendChild(c);})();";}
    private String asset(String name){try(InputStream in=getAssets().open(name);ByteArrayOutputStream out=new ByteArrayOutputStream()){byte[] b=new byte[4096];int n;while((n=in.read(b))>0)out.write(b,0,n);return new String(out.toByteArray(),StandardCharsets.UTF_8);}catch(Exception e){return "";}}
    private boolean nav(Uri u){if(u==null||u.getScheme()==null)return true;String sc=u.getScheme().toLowerCase();if("http".equals(sc)||"https".equals(sc))return false;if("tel".equals(sc)||"mailto".equals(sc)||"geo".equals(sc)){try{startActivity(new Intent(Intent.ACTION_VIEW,u));}catch(Exception ignored){}return true;}return true;}
    private void showError(){progress.setVisibility(View.GONE);web.setAlpha(0f);error.setVisibility(View.VISIBLE);}
    private LinearLayout errorView(){LinearLayout p=new LinearLayout(this);p.setOrientation(LinearLayout.VERTICAL);p.setGravity(Gravity.CENTER);p.setPadding(dp(28),dp(28),dp(28),dp(28));p.setBackgroundColor(Color.rgb(3,10,15));TextView t=new TextView(this);t.setText("Não foi possível carregar o Rota Lucro");t.setTextColor(Color.WHITE);t.setTextSize(20);t.setGravity(Gravity.CENTER);p.addView(t);TextView m=new TextView(this);m.setText("Verifique sua internet e tente novamente.");m.setTextColor(Color.rgb(170,187,195));m.setGravity(Gravity.CENTER);LinearLayout.LayoutParams mp=new LinearLayout.LayoutParams(-2,-2);mp.setMargins(0,dp(10),0,dp(18));p.addView(m,mp);Button b=new Button(this);b.setText("Tentar novamente");b.setAllCaps(false);b.setOnClickListener(v->{error.setVisibility(View.GONE);web.setAlpha(0f);web.loadUrl(HOME_URL);});p.addView(b,new LinearLayout.LayoutParams(-1,dp(52)));return p;}
    @Override protected void onActivityResult(int r,int c,Intent data){super.onActivityResult(r,c,data);if(r==PICK&&chooser!=null){chooser.onReceiveValue(WebChromeClient.FileChooserParams.parseResult(c,data));chooser=null;}}
    @Override protected void onSaveInstanceState(Bundle b){web.saveState(b);super.onSaveInstanceState(b);}
    @Override public void onBackPressed(){if(web!=null&&web.canGoBack())web.goBack();else super.onBackPressed();}
    @Override protected void onDestroy(){if(web!=null){web.stopLoading();web.setWebChromeClient(null);web.setWebViewClient(null);web.destroy();}super.onDestroy();}
    private int dp(int v){return Math.round(v*getResources().getDisplayMetrics().density);}
}
