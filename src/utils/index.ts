function getFromHTML(html: string, type: 'Element'): Element;
function getFromHTML(html: string, type: 'Document'): Document;

function getFromHTML(html: string, type: 'Document' | 'Element') {
  const parser = new DOMParser();

  switch (type) {
    case 'Document':
      return parser.parseFromString(html, 'text/html');
    case 'Element':
      return parser.parseFromString(html, 'text/xml').firstElementChild;
  }
}

export { getFromHTML };
