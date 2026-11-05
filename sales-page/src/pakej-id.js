// Each shop that frames this page names its own Sellhiz product per package on the embed URL
// (?basic=…&pro=…&usahawan=…), so a package button can ask the host to open its Woo checkout with that package in the
// cart. Only a product UUID or a positive add-to-cart number is kept; anything else is dropped and that button falls
// back to scroll-to-payment.
function m3PakejIds(search) {
  var ok = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}|[1-9][0-9]{0,8})$/i;
  var out = {};
  var q;
  try { q = new URLSearchParams(search || ''); } catch (_) { return out; }
  ['basic', 'pro', 'usahawan'].forEach(function (k) {
    var v = (q.get(k) || '').trim();
    if (ok.test(v)) out[k] = v;
  });
  return out;
}
