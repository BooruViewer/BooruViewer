/* https://github.com/r888888888/danbooru/blob/08b1c765334a36b2e1954ca101097a3c33def338/app/logical/note_sanitizer.rb */

export default function createNoteFragment(rawBody) {
  /* differences from danbooru's sanitiser:
    - doesn't convert links to relative paths
    - doesn't set the rel='nofollow' attribute */

  let templ = document.createElement(`template`);
  templ.innerHTML =
    rawBody.replace(/<( |-|3|:|>|\s*$)/g, `&lt;$1`);

  let frag = templ.content;
  let wlkr = document.createTreeWalker(frag, NodeFilter.SHOW_ALL, null, false);

  for (let node; (node = wlkr.nextNode()) !== null;) {
    switch (node.nodeType) {
      case Node.TEXT_NODE :
      case Node.CDATA_SECTION_NODE :
        continue;

      case Node.ELEMENT_NODE :
        if (node.namespaceURI !== allowedNamespace) {
          break;
        }
        if (!allowedElemNames.has(node.tagName)) {
          break;
        }
        /* remove prohibited attributes: */
        let allowedAttrs =
          allowedAttrNamesByElem[node.tagName]
          || allowedAttrNamesByElem[`*`];
        let attrs = node.getAttributeNames();
        for (let i = 0, n = attrs.length; i < n; ++i) {
          let name = attrs[i];
          if (!allowedAttrs.has(name)) {
            node.removeAttribute(name);
          }
        }
        /* remove prohibited styles: */
        for (let i = node.style.length; --i >= 0;) {
          let name = node.style[i];
          if (!allowedStylePropNames.has(name)) {
            node.style.removeProperty(name);
          }
        }
        if (node.tagName === `A`
          && node.hasAttribute(`href`)
          && !allowedUriSchemes.has(node.protocol))
        {
          node.removeAttribute(`href`);
        }
        continue;
    }
    /* discard current node: */
    wlkr.previousNode();
    node.parentNode.removeChild(node);
  }

  return frag;
};

const allowedNamespace = `http://www.w3.org/1999/xhtml`;

const allowedUriSchemes = new Set([`http:`, `https:`,]);

const allowedElemNames = new Set([
  `CODE`, `CENTER`, `TN`, `H1`, `H2`, `H3`, `H4`, `H5`, `H6`, `A`, `SPAN`,
  `DIV`, `BLOCKQUOTE`, `BR`, `P`, `UL`, `LI`, `OL`, `EM`, `STRONG`,
  `SMALL`, `BIG`, `B`, `I`, `FONT`, `U`, `S`, `PRE`, `RUBY`, `RB`, `RT`,
  `RP`, `RTC`, `SUB`, `SUP`, `HR`, `WBR`,]);

const allowedAttrNamesByElem = {
  [`*`] : new Set([`style`, `title`,]),
  [`A`] : new Set([`style`, `title`, `href`,]),
  [`SPAN`] : new Set([`style`, `title`, `class`,]),
  [`DIV`] : new Set([`style`, `title`, `class`, `align`,]),
  [`P`] : new Set([`style`, `title`, `class`, `align`,]),
  [`FONT`] : new Set([`style`, `title`, `color`, `size`,]),
};

const allowedStylePropNames = new Set([
  `background-color`,
  `background-position-x`,
  `background-position-y`,
  `background-repeat`,
  `background-attachment`,
  `background-image`,
  `background-size`,
  `background-origin`,
  `background-clip`,
  `border-top-color`,
  `border-top-style`,
  `border-top-width`,
  `border-left-color`,
  `border-left-style`,
  `border-left-width`,
  `border-bottom-color`,
  `border-bottom-style`,
  `border-bottom-width`,
  `border-right-color`,
  `border-right-style`,
  `border-right-width`,
  `border-image-outset`,
  `border-image-repeat`,
  `border-image-slice`,
  `border-image-source`,
  `border-image-width`,
  `border-top-left-radius`,
  `border-top-right-radius`,
  `border-bottom-right-radius`,
  `border-bottom-left-radius`,
  `bottom`,
  `left`,
  `right`,
  `top`,
  `box-shadow`,
  `clear`,
  `color`,
  `display`,
  `filter`,
  `float`,
  `font-style`,
  `font-variant-caps`,
  `font-weight`,
  `font-stretch`,
  `font-size`,
  `line-height`,
  `font-family`,
  `font-size-adjust`,
  `font-kerning`,
  `font-variant-alternates`,
  `font-variant-east-asian`,
  `font-variant-ligatures`,
  `font-variant-numeric`,
  `font-variant-position`,
  `font-language-override`,
  `font-feature-settings`,
  `height`,
  `width`,
  `letter-spacing`,
  `list-style-position`,
  `list-style-image`,
  `list-style-type`,
  `margin-top`,
  `margin-right`,
  `margin-bottom`,
  `margin-left`,
  `mask-mode`,
  `mask-repeat`,
  `mask-clip`,
  `mask-origin`,
  `mask-composite`,
  `mask-position-x`,
  `mask-position-y`,
  `mask-size`,
  `mask-image`,
  `opacity`,
  `outline-width`,
  `outline-style`,
  `outline-color`,
  `outline-offset`,
  `padding-top`,
  `padding-right`,
  `padding-bottom`,
  `padding-left`,
  `perspective`,
  `perspective-origin`,
  `position`,
  `text-align`,
  `text-decoration-line`,
  `text-decoration-style`,
  `text-decoration-color`,
  `text-indent`,
  `text-shadow`,
  `text-transform`,
  `transform`,
  `transform-origin`,
  `white-space`,
  `word-break`,
  `word-spacing`,
  `overflow-wrap`,
  `writing-mode`,
  `vertical-align`,]);
