/*
使用示例:
draggable(el,{
  start:e=>{},
  drag:e=>{},
  endL:e=>{}
})
*/
const _userAgent = navigator.userAgent;
export const isMobile = /iphone|ipod|ipad|ipad|Android|nokia|blackberry|webos|webos|webmate|bada|lg|ucweb/i.test(
  _userAgent
);
const startEvent = isMobile ? 'touchstart' : 'mousedown';
const moveEvent = isMobile ? 'touchmove' : 'mousemove';
const endEvent = isMobile ? 'touchend' : 'mouseup';

let isDragging = false;

export default function(element, options) {
  const isCaptrue = options.isCaptrue || false;
  const moveFn = function(event) {
    if (options.drag) {
      options.drag(event);
    }
  };
  const upFn = function(event) {
    document.removeEventListener(moveEvent, moveFn, isCaptrue);
    document.removeEventListener(endEvent, upFn, isCaptrue);
    document.onselectstart = null;
    document.ondragstart = null;

    isDragging = false;

    if (options.end) {
      options.end(event);
    }
  };
  element.addEventListener(
    startEvent,
    function(event) {
      if (isDragging) return;
      document.onselectstart = function() {
        return false;
      };
      document.ondragstart = function() {
        return false;
      };
      document.addEventListener(moveEvent, moveFn, isCaptrue);
      document.addEventListener(endEvent, upFn, isCaptrue);
      isDragging = true;

      if (options.start) {
        options.start(event);
      }
    },
    isCaptrue
  );
}
