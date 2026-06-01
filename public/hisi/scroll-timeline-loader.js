/**
 * Hísi Anim - Carga condicional del polyfill scroll-timeline.
 * Solo en navegadores SIN soporte nativo de animation-timeline: view()
 * (p. ej. Firefox), para que los efectos ha--scroll* funcionen ahí.
 */
( function () {
	'use strict';
	var supported = window.CSS && CSS.supports && CSS.supports( 'animation-timeline: view()' );
	if ( supported ) {
		return;
	}
	var s = document.createElement( 'script' );
	s.src = ( window.hisiAnimPolyfill && window.hisiAnimPolyfill.url ) || '';
	if ( s.src ) {
		document.head.appendChild( s );
	}
} )();
