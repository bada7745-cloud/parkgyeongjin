import SwiftUI
import WebKit

final class GameSession: ObservableObject {
    let webView: WKWebView
    init() {
        let config = WKWebViewConfiguration()
        config.websiteDataStore = .default()
        config.allowsInlineMediaPlayback = true
        webView = WKWebView(frame: .zero, configuration: config)
        webView.customUserAgent = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Version/17.0 Mobile/15E148 Safari/604.1 PocketCrittersiOS/0.3"
        webView.isOpaque = false
        webView.backgroundColor = UIColor(red: 0.09, green: 0.24, blue: 0.29, alpha: 1)
        webView.scrollView.isScrollEnabled = false
    }
    func pause() { webView.evaluateJavaScript("window.dispatchEvent(new Event('blur'))", completionHandler: nil) }
}
@main struct PocketCrittersApp: App {
    @StateObject private var session = GameSession()
    @Environment(\.scenePhase) private var scenePhase
    var body: some Scene {
        WindowGroup {
            GameView(session: session).ignoresSafeArea().statusBarHidden()
                .onChange(of: scenePhase) { phase in if phase != .active { session.pause() } }
        }
    }
}
struct GameView: UIViewRepresentable {
    @ObservedObject var session: GameSession
    func makeCoordinator() -> Coordinator { Coordinator() }
    func makeUIView(context: Context) -> WKWebView {
        let web = session.webView
        web.navigationDelegate = context.coordinator
        web.uiDelegate = context.coordinator
        let raw = Bundle.main.object(forInfoDictionaryKey: "GameOrigin") as? String ?? ""
        if let url = URL(string: raw), url.scheme == "https", url.host != nil, url.user == nil, url.query == nil, url.fragment == nil {
            context.coordinator.origin = url
            web.load(URLRequest(url: url, cachePolicy: .reloadIgnoringLocalCacheData))
        } else { context.coordinator.fallback(web) }
        return web
    }
    func updateUIView(_ uiView: WKWebView, context: Context) {}
    final class Coordinator: NSObject, WKNavigationDelegate, WKUIDelegate {
        var origin: URL?
        var offline = false
        func webView(_ webView: WKWebView, runJavaScriptConfirmPanelWithMessage message: String, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping (Bool) -> Void) {
            DispatchQueue.main.async {
                guard let scene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
                      var root = scene.windows.first(where: { $0.isKeyWindow })?.rootViewController else { completionHandler(false); return }
                while let presented = root.presentedViewController { root = presented }
                let alert = UIAlertController(title: "포켓 크리터즈", message: message, preferredStyle: .alert)
                alert.addAction(UIAlertAction(title: "취소", style: .cancel) { _ in completionHandler(false) })
                alert.addAction(UIAlertAction(title: "확인", style: .default) { _ in completionHandler(true) })
                root.present(alert, animated: true)
            }
        }
        func fallback(_ web: WKWebView) {
            guard !offline else { return }; offline = true
            if let file = Bundle.main.url(forResource: "index", withExtension: "html", subdirectory: "Game") {
                web.loadFileURL(file, allowingReadAccessTo: file.deletingLastPathComponent())
            }
        }
        func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) { fallback(webView) }
        func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
            guard let url = navigationAction.request.url else { decisionHandler(.cancel); return }
            let trusted = url.isFileURL || (url.scheme == "https" && url.host == origin?.host && (url.port ?? 443) == (origin?.port ?? 443))
            decisionHandler(trusted ? .allow : .cancel)
        }
    }
}
