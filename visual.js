class Visual {
  constructor (templateContainer, templateId, visualContainer) {
    var templates = document.getElementById(templateContainer);
    // var template = templates.contentDocument.document.getElementById(templateId);
    this.div = templates.contentDocument.querySelector("#"+templateId).cloneNode(true);
    this.div.o = this;

    document.getElementById(visualContainer).appendChild(this.div);
  }
}

export {Visual};
