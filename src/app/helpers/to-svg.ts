export function toSVG(canvas: HTMLCanvasElement, signaturePad: any) {
  const ratio = 1;
  const minX = 0;
  const minY = 0;
  const maxX = canvas.width / ratio;
  const maxY = canvas.height / ratio;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', canvas.width.toString());
  svg.setAttribute('height', canvas.height.toString());
  signaturePad._fromData(signaturePad.toData(), ({ color, curve }) => {
    const path = document.createElement('path');
    if (!isNaN(curve.control1.x) &&
      !isNaN(curve.control1.y) &&
      !isNaN(curve.control2.x) &&
      !isNaN(curve.control2.y)) {
      const attr = `M ${curve.startPoint.x.toFixed(3)},${curve.startPoint.y.toFixed(3)} ` +
        `C ${curve.control1.x.toFixed(3)},${curve.control1.y.toFixed(3)} ` +
        `${curve.control2.x.toFixed(3)},${curve.control2.y.toFixed(3)} ` +
        `${curve.endPoint.x.toFixed(3)},${curve.endPoint.y.toFixed(3)}`;
      path.setAttribute('d', attr);
      path.setAttribute('stroke-width', (curve.endWidth * 2.25).toFixed(3));
      path.setAttribute('stroke', color);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke-linecap', 'round');
      svg.appendChild(path);
    }
  }, ({ color, point }) => {
    const circle = document.createElement('circle');
    let dotSize = signaturePad.dotSize;
    dotSize = typeof dotSize === 'function' ? dotSize() : dotSize;
    circle.setAttribute('r', dotSize.toString());
    circle.setAttribute('cx', point.x.toString());
    circle.setAttribute('cy', point.y.toString());
    circle.setAttribute('fill', color);
    svg.appendChild(circle);
  });
  const prefix = 'data:image/svg+xml;base64,';
  const header = '<svg' +
    ' xmlns="http://www.w3.org/2000/svg"' +
    ' xmlns:xlink="http://www.w3.org/1999/xlink"' +
    ` viewBox="${minX} ${minY} ${maxX} ${maxY}"` +
    ` width="${maxX}"` +
    ` height="${maxY}"` +
    '>';
  let body = svg.innerHTML;
  if (body === undefined) {
    const dummy = document.createElement('dummy');
    const nodes = svg.childNodes;
    dummy.innerHTML = '';
    for (let i = 0; i < nodes.length; i += 1) {
      dummy.appendChild(nodes[i].cloneNode(true));
    }
    body = dummy.innerHTML;
  }
  const footer = '</svg>';
  const data = header + body + footer;

  return prefix + btoa(data);
}
