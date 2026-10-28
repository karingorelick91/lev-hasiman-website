/* Hide the 197₪ launch offer after 7 Nov 2026, 23:59 Israel time.
 * Checkout pricing is configured independently in Schooler/Cardcom.
 */
(function(){
  var expiry = Date.parse('2026-11-07T23:59:59+02:00');
  var expired = Date.now() > expiry;
  document.querySelectorAll('[data-launch-visible]').forEach(function(el){el.hidden=expired;});
  document.querySelectorAll('[data-launch-expired]').forEach(function(el){el.hidden=!expired;});
})();
