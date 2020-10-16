function GooncaSmoothIn() {

  const DISTANCE = 75;
  const IS_TWO_WAYS = true;

  const offset = el => {
    var rect = el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
  }

  document.body.style.overflowX = 'hidden';
  this.containers = document.querySelectorAll('[go-smooth-in]');
  this.containers.forEach((cur, i) => {

    cur.setAttribute('go-top', offset(cur).top);
    cur.setAttribute('go-direction', (cur.getAttribute('go-smooth-in') || 'left'));
    cur.setAttribute('go-init-left', parseInt(cur.style.left) || 0);
    cur.setAttribute('go-init-top', parseInt(cur.style.top) || 0);

    //TODO control absolute
    cur.style.position = 'relative';
    cur.style.opacity = '0';
    //TODO + from the current left/right
    const directionAttr = cur.getAttribute('go-direction');
    if('leftright'.includes(directionAttr)) {
      cur.style.left = `${directionAttr == 'left' ? '-' : ''}${DISTANCE}px`;
    } else if(directionAttr == 'up') {
      cur.style.top = `${DISTANCE}px`;
    }

  });

  this.refreshPositions = () => {

    this.containers.forEach((cur, i) => {

      const directionAttr = cur.getAttribute('go-direction');

      if('leftright'.includes(directionAttr)) {
        if(parseInt(cur.getAttribute('go-init-left')) == parseInt(cur.style.left) && !IS_TWO_WAYS)
          return;
      } else if(directionAttr == 'up') {
        if(parseInt(cur.getAttribute('go-init-top')) == parseInt(cur.style.top) && !IS_TWO_WAYS)
          return;
      }

      const grossCurse = Math.min(
        Math.max(0, Math.round(window.innerHeight + document.documentElement.scrollTop) - Math.round(offset(cur).top)),
        cur.offsetHeight / 2
      );

      const netCourse = Math.round(grossCurse * DISTANCE / (cur.offsetHeight / 2));

      let move = (DISTANCE - netCourse) * (directionAttr == 'right' || cur.getAttribute('go-direction') == 'up' ? 1 : -1);
      if('leftright'.includes(directionAttr)) {
        cur.style.left = `${move}px`;
      } else {
        cur.style.top = `${move}px`;
      }
      cur.style.opacity = `${netCourse / DISTANCE}`;
    });
  }

  window.addEventListener('scroll', this.refreshPositions);
  window.addEventListener('load', this.refreshPositions);
}

window.addEventListener('DOMContentLoaded', () => (new GooncaSmoothIn()));