package com.pocketcritters.game;
import android.app.Activity;
import android.os.Bundle;
import android.net.Uri;
import android.view.View;
import android.webkit.*;
import org.json.JSONObject;
import java.io.*;
import java.util.*;

public final class MainActivity extends Activity {
 private WebView web;private String gameOrigin="";private boolean offline=false;
 private byte[] readBytes(InputStream in)throws IOException{ByteArrayOutputStream out=new ByteArrayOutputStream();byte[] b=new byte[8192];int n;while((n=in.read(b))!=-1)out.write(b,0,n);return out.toByteArray();}
 @Override public void onCreate(Bundle state){super.onCreate(state);immersive();try(InputStream in=getAssets().open("app-config.json")){String value=new JSONObject(new String(readBytes(in),"UTF-8")).optString("gameOrigin","");Uri u=Uri.parse(value);if("https".equals(u.getScheme())&&u.getHost()!=null&&u.getUserInfo()==null&&("".equals(u.getPath())||"/".equals(u.getPath()))&&u.getQuery()==null&&u.getFragment()==null)gameOrigin=value.replaceAll("/+$","");}catch(Exception ignored){}
 web=new WebView(this);web.setWebChromeClient(new WebChromeClient());web.setBackgroundColor(0xff173e4b);WebSettings settings=web.getSettings();settings.setJavaScriptEnabled(true);settings.setDomStorageEnabled(true);settings.setAllowFileAccess(false);settings.setAllowContentAccess(false);settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);settings.setCacheMode(WebSettings.LOAD_NO_CACHE);settings.setUserAgentString(settings.getUserAgentString()+" PocketCrittersAndroid/0.3");CookieManager.getInstance().setAcceptCookie(true);CookieManager.getInstance().setAcceptThirdPartyCookies(web,false);
 web.setWebViewClient(new WebViewClient(){
  @Override public boolean shouldOverrideUrlLoading(WebView view,WebResourceRequest request){Uri u=request.getUrl();return !(u.toString().startsWith("https://appassets.androidplatform.net/assets/")||(!gameOrigin.isEmpty()&&sameOrigin(u)));}
  @Override public void onReceivedError(WebView view,WebResourceRequest request,WebResourceError error){if(request.isForMainFrame()&&!offline)fallback();}
  @Override public void onReceivedHttpError(WebView view,WebResourceRequest request,WebResourceResponse response){if(request.isForMainFrame()&&response.getStatusCode()>=500&&!offline)fallback();}
  @Override public WebResourceResponse shouldInterceptRequest(WebView view,WebResourceRequest request){Uri u=request.getUrl();if(!gameOrigin.isEmpty()&&sameOrigin(u))return null;String p=u.getPath();if(!"https".equals(u.getScheme())||!"appassets.androidplatform.net".equals(u.getHost())||p==null||!p.startsWith("/assets/")||p.contains(".."))return error();try{String n=p.substring(8);String mime=n.endsWith(".html")?"text/html":n.endsWith(".js")?"application/javascript":n.endsWith(".css")?"text/css":n.endsWith(".png")?"image/png":n.endsWith(".svg")?"image/svg+xml":"application/json";return new WebResourceResponse(mime,"UTF-8",200,"OK",Collections.singletonMap("Cache-Control","no-cache"),getAssets().open(n));}catch(Exception e){return error();}}
  private WebResourceResponse error(){return new WebResourceResponse("text/plain","UTF-8",404,"Not Found",null,new ByteArrayInputStream(new byte[0]));}
 });setContentView(web);if(gameOrigin.isEmpty())fallback();else web.loadUrl(gameOrigin+"/");}
 private boolean sameOrigin(Uri u){Uri base=Uri.parse(gameOrigin);int a=u.getPort()<0?443:u.getPort(),b=base.getPort()<0?443:base.getPort();return "https".equals(u.getScheme())&&Objects.equals(base.getHost(),u.getHost())&&a==b;}
 private void fallback(){offline=true;web.loadUrl("https://appassets.androidplatform.net/assets/index.html");}
 private void immersive(){getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_FULLSCREEN|View.SYSTEM_UI_FLAG_HIDE_NAVIGATION|View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY|View.SYSTEM_UI_FLAG_LAYOUT_STABLE|View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN|View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION);}
 @Override public void onWindowFocusChanged(boolean focus){super.onWindowFocusChanged(focus);if(focus)immersive();}
 @Override protected void onPause(){if(web!=null){web.evaluateJavascript("window.dispatchEvent(new Event('blur'))",null);CookieManager.getInstance().flush();web.onPause();web.pauseTimers();}super.onPause();}
 @Override protected void onResume(){super.onResume();if(web!=null){web.onResume();web.resumeTimers();}}
 @Override public void onBackPressed(){web.evaluateJavascript("window.dispatchEvent(new CustomEvent('pc:external-pause'))",null);}
 @Override protected void onDestroy(){if(web!=null){web.destroy();web=null;}super.onDestroy();}
}

