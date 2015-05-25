class Formatter {

  formatBlock(block) {
    var elements = block.get("elements");
    var characters = block.get("content").split("");
    var openers = {};
    var closers = {};
    this.parseElements(elements, openers, closers);
    return this.mergeElements(characters, openers, closers);
  }

  parseElements(elements, openers, closers) {
    elements.map(function(element) {
      var start = element.get("start");
      var end = element.get("end");
      var opener = "";
      var closer = "";
      switch (element.get("type")) {
        case "bold":
          opener = "strong";
          closer = "strong";
          break;
      }
      if (openers[start]) {
        openers[start].push("<" + opener + ">");
      } else {
        openers[start] = ["<" + opener + ">"]
      }
      if (closers[end]) {
        closers[end].push("</" + closer +">");
      } else {
        closers[end] = ["</" + closer + ">"];
      }
    });
  }

  mergeElements(characters, openers, closers) {
    var content = "";
    for (var i = 0; i < characters.length; i += 1) {
      if (openers[i]) {
        content += openers[i];
      } else if (closers[i]) {
        content += closers[i];
      }
      if ((i === 0 || i === characters.length - 1) && characters[i] === " ") {
        content += "&nbsp;";
      } else {
        content += characters[i];
      }
    }
    return content;
  }
}


module.exports = new Formatter();
