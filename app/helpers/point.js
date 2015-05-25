class Point {

  constructor(sectionIndex=0, blockIndex=0, caretOffset=0, needsOffset=false) {
    this._sectionIndex = sectionIndex;
    this._blockIndex = blockIndex;
    this._caretOffset = caretOffset;
    this._needsOffset = needsOffset;
  }

  get sectionIndex() {
    return this._sectionIndex;
  }

  get blockIndex() {
    return this._blockIndex;
  }

  get caretOffset() {
    return this._caretOffset;
  }

  get needsOffset() {
    return this._needsOffset;
  }

  set sectionIndex(sectionIndex) {
    this._sectionIndex = sectionIndex;
  }

  set blockIndex(blockIndex) {
    this._blockIndex = blockIndex;
  }

  set caretOffset(caretOffset) {
    this._caretOffset = caretOffset;
  }

  set needsOffset(needsOffset) {
    this._needsOffset = needsOffset;
  }

  compareDeeply(other) {
    var sectionDifference = this._sectionIndex - other.getSectionIndex();
    if (sectionDifference === 0) {
      var blockDifference = this._blockIndex - other.getBlockIndex();
      if (blockDifference === 0) {
        return this._caretOffset - other.getCaretOffset();
      } else {
        return blockDifference;
      }
    } else {
      return sectionDifference;
    }
  }

  equalsDeeply(other) {
    return this.equalsShallowly(other) && this._caretOffset === other.getCaretOffset();
  }

  prefixesBlock() {
    return this._caretOffset === 0;
  }

  prefixesEverything() {
    return this._sectionIndex === 0 && this._blockIndex === 0;
  }
}


module.exports = Point;
