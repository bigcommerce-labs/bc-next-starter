// This component ensures the BigCommerce Widget scripts are reloaded on client side renders of pages,
// since by default the browser will not re-run scripts that have already been loaded and many BC widgets
// require an external script to render

export default function WidgetScriptForceReloader() {
  if (typeof document !== 'undefined') {
    setTimeout(function(){
      document.querySelectorAll('.bc-widget-container > script')
        .forEach((element) => {
        const originalScriptCode = element.innerHTML; 
        
        var s = document.createElement('script');
        s.type = 'text/javascript';
        try {
            s.appendChild(document.createTextNode(originalScriptCode));
            element.appendChild(s);
        } catch (e) {
            s.text = originalScriptCode;
            element.appendChild(s);
        }
        })
    }, 1)
  }

  return null
}
