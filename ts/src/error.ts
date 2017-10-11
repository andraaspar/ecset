let count = 0
window.onerror = function(m, f, r, c, e) {
	if (count >= 10) return
	count++
	let markup = document.createElement('div')
	markup.className = 'error-popup'
	markup.innerHTML = `
		<h2>Error</h2>
		<dl>
			<dt>Message</dt>
			<dd>${escapeHtml(m)}</dd>
			<dt>File</dt>
			<dd>${escapeHtml(f)}</dd>
			<dt>Row:column</dt>
			<dd>${r}:${c}</dd>
			<dt>Stack</dt>
			<dd>${escapeHtml(e && e.stack)}</dd>
		</dl>
		<p><button>Close</button></p>
`
	document.body.appendChild(markup)
	let handler: EventListener
	markup.addEventListener('click', handler = (e) => {
		if ((e.target as HTMLElement).nodeName.toLowerCase() === 'button') {
			markup.removeEventListener('click', handler)
			document.body.removeChild(markup)
		}
	})
}
let entityMap: {[_: string]: string} = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	"'": '&#39;',
}
function escapeHtml (s: string) {
	return String(s).replace(/[&<>"']/g, function (s) {
		return entityMap[s]
	})
}
